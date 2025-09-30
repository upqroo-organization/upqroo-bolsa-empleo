import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        cvUrl: true,
        career: true,
        period: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        jobExperience: {
          select: {
            id: true,
            title: true,
            description: true,
            initialDate: true,
            endDate: true,
            companyName: true,
            jobRole: true,
          },
          orderBy: {
            initialDate: 'desc',
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, username, career, period, jobExperience } = body;

    // Validate required fields
    if (!name || !username) {
      return NextResponse.json(
        { error: 'Nombre y nombre de usuario son requeridos' },
        { status: 400 }
      );
    }

    // Validate job experience data if provided
    if (jobExperience && Array.isArray(jobExperience)) {
      for (const exp of jobExperience) {
        if (!exp.title || !exp.companyName || !exp.jobRole || !exp.initialDate || !exp.endDate) {
          return NextResponse.json(
            { error: 'Todos los campos de experiencia laboral son requeridos' },
            { status: 400 }
          );
        }

        // Validate dates
        const startDate = new Date(exp.initialDate);
        const endDate = new Date(exp.endDate);

        if (startDate >= endDate) {
          return NextResponse.json(
            { error: 'La fecha de inicio debe ser anterior a la fecha de fin' },
            { status: 400 }
          );
        }
      }
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está en uso' },
        { status: 409 }
      );
    }

    // Use transaction to update user and job experiences
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update user basic data
      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name: name.trim(),
          username: username.trim(),
          career: career?.trim() || null,
          period: period || null,
        },
      });

      // Handle job experiences
      if (jobExperience && Array.isArray(jobExperience)) {
        // Delete existing experiences that are not in the new list
        const existingExperienceIds = jobExperience
          .filter(exp => exp.id)
          .map(exp => exp.id);

        if (existingExperienceIds.length > 0) {
          await tx.userJobExperience.deleteMany({
            where: {
              userId: session.user.id,
              id: {
                notIn: existingExperienceIds,
              },
            },
          });
        } else {
          // Delete all existing experiences if no IDs provided
          await tx.userJobExperience.deleteMany({
            where: {
              userId: session.user.id,
            },
          });
        }

        // Upsert job experiences
        for (const exp of jobExperience) {
          const experienceData = {
            title: exp.title.trim(),
            description: exp.description.trim(),
            initialDate: new Date(exp.initialDate),
            endDate: new Date(exp.endDate),
            companyName: exp.companyName.trim(),
            jobRole: exp.jobRole.trim(),
            userId: session.user.id,
          };

          if (exp.id) {
            // Update existing experience
            await tx.userJobExperience.update({
              where: {
                id: exp.id,
                userId: session.user.id,
              },
              data: experienceData,
            });
          } else {
            // Create new experience
            await tx.userJobExperience.create({
              data: experienceData,
            });
          }
        }
      } else {
        // If no job experiences provided, delete all existing ones
        await tx.userJobExperience.deleteMany({
          where: {
            userId: session.user.id,
          },
        });
      }

      // Return updated user with all related data
      return await tx.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          image: true,
          cvUrl: true,
          career: true,
          period: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          jobExperience: {
            select: {
              id: true,
              title: true,
              description: true,
              initialDate: true,
              endDate: true,
              companyName: true,
              jobRole: true,
            },
            orderBy: {
              initialDate: 'desc',
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Perfil actualizado correctamente',
    });

  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}