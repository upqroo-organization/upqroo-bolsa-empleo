import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    const applications = await prisma.application.findMany({
      where: { vacanteId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cvUrl: true
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