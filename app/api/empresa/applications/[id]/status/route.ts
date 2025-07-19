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

    const { id: applicationId } = params;
    const { status } = await request.json();

    // Validate status
    const validStatuses = ['pending', 'interview', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Verify the application belongs to a job from this company
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        vacante: {
          companyId: session.user.id
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        vacante: {
          select: {
            title: true
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Aplicación no encontrada' },
        { status: 404 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
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
    });

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: `Estado actualizado a ${getStatusLabel(status)}`
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    interview: 'En entrevista',
    rejected: 'Rechazado',
    hired: 'Contratado'
  };
  return labels[status] || status;
}