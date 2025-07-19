import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id: vacanteId } = params;
    const { action } = await request.json(); // 'pause' or 'activate'

    // Verify the job belongs to the company
    const vacante = await prisma.vacante.findFirst({
      where: {
        id: vacanteId,
        companyId: session.user.id
      }
    });

    if (!vacante) {
      return NextResponse.json(
        { error: 'Vacante no encontrada' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (action === 'pause') {
      // Set deadline to past date to effectively pause the job
      updateData.deadline = new Date('2000-01-01');
    } else if (action === 'activate') {
      // Set deadline to future date or null to reactivate
      updateData.deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    } else {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      );
    }

    const updatedVacante = await prisma.vacante.update({
      where: { id: vacanteId },
      data: updateData,
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedVacante,
      message: action === 'pause' ? 'Vacante pausada' : 'Vacante reactivada'
    });

  } catch (error) {
    console.error('Error toggling job status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}