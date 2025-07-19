import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company ID from session
    const company = await prisma.company.findUnique({
      where: { id: session.user.id }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filters: any = {
      companyId: company.id
    };

    // Add status filter if provided
    if (status && status !== 'all') {
      if (status === 'active') {
        filters.deadline = { gte: new Date() };
      } else if (status === 'expired') {
        filters.deadline = { lt: new Date() };
      }
    }

    const vacantes = await prisma.vacante.findMany({
      where: filters,
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
        },
        state: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add computed fields
    const vacantesWithStatus = vacantes.map(vacante => ({
      ...vacante,
      status: getJobStatus(vacante),
      applicationsCount: vacante._count.applications
    }));

    return NextResponse.json({
      success: true,
      data: vacantesWithStatus
    });

  } catch (error) {
    console.error('Error fetching company jobs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function getJobStatus(vacante: any) {
  if (!vacante.deadline) return 'active';
  
  const now = new Date();
  const deadline = new Date(vacante.deadline);
  
  if (deadline < now) return 'expired';
  return 'active';
}