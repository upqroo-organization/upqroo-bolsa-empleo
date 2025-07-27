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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const newVacante = await prisma.vacante.create({
      data: {
        title: body.title,
        summary: body.summary || body.description?.substring(0, 200) || '',
        description: body.description,
        responsibilities: body.responsibilities || body.description,
        requirements: body.requirements || '',
        benefits: body.benefits || '',
        location: body.location,
        salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
        career: body.career,
        department: body.department,
        type: body.type,
        modality: body.modality || 'On-site',
        numberOfPositions: body.numberOfPositions || 1,
        companyId: company.id,
        deadline: body.deadline ? new Date(body.deadline) : null,
        status: 'active',
        applicationProcess: body.applicationProcess
      }
    });

    return NextResponse.json({
      success: true,
      data: newVacante,
      message: 'Vacante creada correctamente'
    });

  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getJobStatus(vacante: any) {
  // Use the status field if available, otherwise compute from deadline
  if (vacante.status) return vacante.status;
  
  if (!vacante.deadline) return 'active';
  
  const now = new Date();
  const deadline = new Date(vacante.deadline);
  
  if (deadline < now) return 'expired';
  return 'active';
}