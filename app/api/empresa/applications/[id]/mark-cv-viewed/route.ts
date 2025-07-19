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

    // Verify the application belongs to a job from this company
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        vacante: {
          companyId: session.user.id
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
      data: { cvViewed: true },
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
      data: updatedApplication
    });

  } catch (error) {
    console.error('Error marking CV as viewed:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}