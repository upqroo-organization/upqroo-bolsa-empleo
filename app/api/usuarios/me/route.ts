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
        role: {
          select: {
            id: true,
            name: true,
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
    const { name, username } = body;

    // Validate required fields
    if (!name || !username) {
      return NextResponse.json(
        { error: 'Nombre y nombre de usuario son requeridos' },
        { status: 400 }
      );
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

    // Update user data
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name.trim(),
        username: username.trim(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        cvUrl: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
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