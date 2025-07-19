import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          error: 'No autorizado',
          details: 'Debes iniciar sesión para aplicar a una vacante'
        },
        { status: 401 }
      );
    }

    const { vacanteId } = await request.json();

    if (!vacanteId) {
      return NextResponse.json(
        { 
          error: 'Datos incompletos',
          details: 'ID de vacante requerido para procesar la aplicación'
        },
        { status: 400 }
      );
    }

    // Check if user already applied to this job
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_vacanteId: {
          userId: session.user.id,
          vacanteId: vacanteId
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { 
          error: 'Ya has aplicado a esta vacante',
          details: 'No puedes aplicar múltiples veces a la misma vacante'
        },
        { status: 400 }
      );
    }

    // Check if the job exists
    const vacante = await prisma.vacante.findUnique({
      where: { id: vacanteId },
      include: { company: true }
    });

    if (!vacante) {
      return NextResponse.json(
        { 
          error: 'Vacante no encontrada',
          details: 'La vacante solicitada no existe o ha sido eliminada'
        },
        { status: 404 }
      );
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        vacanteId: vacanteId,
        status: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cvUrl: true
          }
        },
        vacante: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: application,
      message: 'Aplicación enviada exitosamente',
      details: `Tu aplicación para ${vacante.title} en ${vacante.company.name} ha sido procesada correctamente`
    });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: 'No se pudo procesar tu aplicación. Intenta nuevamente en unos momentos.'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const vacanteId = searchParams.get('vacanteId');

    if (vacanteId) {
      // Check if user has applied to specific job
      const application = await prisma.application.findUnique({
        where: {
          userId_vacanteId: {
            userId: session.user.id,
            vacanteId: vacanteId
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: { hasApplied: !!application }
      });
    }

    // Get all user applications
    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      include: {
        vacante: {
          include: {
            company: {
              select: {
                name: true,
                logoUrl: true
              }
            },
            state: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}