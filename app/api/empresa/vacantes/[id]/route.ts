import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get job details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company data
    const company = await prisma.company.findUnique({
      where: { email: session.user.email }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const { id } = params;

    const job = await prisma.vacante.findFirst({
      where: {
        id: id,
        companyId: company.id
      },
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                cvUrl: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Vacante no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        applicationsCount: job.applications.length
      }
    });

  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Update job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company data
    const company = await prisma.company.findUnique({
      where: { email: session.user.email }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Verify job belongs to company
    const existingJob = await prisma.vacante.findFirst({
      where: {
        id: id,
        companyId: company.id
      }
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Vacante no encontrada' },
        { status: 404 }
      );
    }

    const updatedJob = await prisma.vacante.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        benefits: body.benefits,
        department: body.department,
        type: body.type,
        location: body.location,
        salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        career: body.career,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: 'Vacante actualizada correctamente'
    });

  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company data
    const company = await prisma.company.findUnique({
      where: { email: session.user.email }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const { id } = params;

    // Verify job belongs to company
    const existingJob = await prisma.vacante.findFirst({
      where: {
        id: id,
        companyId: company.id
      }
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Vacante no encontrada' },
        { status: 404 }
      );
    }

    // Check if job has applications
    const applicationsCount = await prisma.application.count({
      where: { vacanteId: id }
    });

    if (applicationsCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una vacante con postulaciones' },
        { status: 400 }
      );
    }

    await prisma.vacante.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Vacante eliminada correctamente'
    });

  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}