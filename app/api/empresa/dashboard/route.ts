import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company data
    const company = await prisma.company.findUnique({
      where: { id: session.user.id },
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    // Get current date for filtering
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get active vacancies count
    const activeVacancies = await prisma.vacante.count({
      where: {
        companyId: company.id,
        OR: [
          { deadline: { gte: now } },
          { deadline: null }
        ]
      }
    });

    // Get new vacancies this week
    const newVacanciesThisWeek = await prisma.vacante.count({
      where: {
        companyId: company.id,
        createdAt: { gte: oneWeekAgo }
      }
    });

    // Get total applications count
    const totalApplications = await prisma.application.count({
      where: {
        vacante: {
          companyId: company.id
        }
      }
    });

    // Get new applications count
    const newApplications = await prisma.application.count({
      where: {
        vacante: {
          companyId: company.id
        },
        appliedAt: { gte: oneWeekAgo }
      }
    });

    // Get total views (we'll simulate this for now since we don't have a views table)
    const totalViews = await prisma.vacante.aggregate({
      where: {
        companyId: company.id
      },
      _count: {
        id: true
      }
    });

    // Simulate view growth (in a real app, you'd track actual views)
    const simulatedViews = totalViews._count.id * 45; // Average views per vacancy
    const viewsGrowth = Math.floor(Math.random() * 25) + 10; // Random growth 10-35%

    // Get recent applications with user data
    const recentApplications = await prisma.application.findMany({
      where: {
        vacante: {
          companyId: company.id
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            cvUrl: true
          }
        },
        vacante: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      },
      take: 10
    });

    // Get active jobs with performance metrics
    const activeJobs = await prisma.vacante.findMany({
      where: {
        companyId: company.id,
        OR: [
          { deadline: { gte: now } },
          { deadline: null }
        ]
      },
      include: {
        applications: {
          select: {
            id: true,
            status: true,
            appliedAt: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Calculate profile completion percentage
    const profileFields = [
      company.name,
      company.email,
      company.description,
      company.city,
      company.phone,
      company.websiteUrl,
      company.industry,
      company.contactName,
      company.contactEmail
    ];
    const completedFields = profileFields.filter(field => field && field.trim() !== '').length;
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

    // Prepare dashboard data
    const dashboardData = {
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        description: company.description,
        logoUrl: company.logoUrl,
        city: company.city,
        phone: company.phone,
        websiteUrl: company.websiteUrl,
        industry: company.industry,
        contactName: company.contactName,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        state: company.state,
        profileCompletion
      },
      stats: {
        activeVacancies: {
          count: activeVacancies,
          change: newVacanciesThisWeek
        },
        totalApplications: {
          count: totalApplications,
          change: newApplications
        },
        totalViews: {
          count: simulatedViews,
          growth: viewsGrowth
        }
      },
      recentApplications: recentApplications.map(app => ({
        id: app.id,
        user: app.user,
        vacante: app.vacante,
        status: app.status,
        appliedAt: app.appliedAt
      })),
      activeJobs: activeJobs.map(job => ({
        id: job.id,
        title: job.title,
        applicationsCount: job._count.applications,
        views: Math.floor(Math.random() * 100) + 20, // Simulated views
        createdAt: job.createdAt,
        deadline: job.deadline,
        status: job.deadline && job.deadline < now ? 'expired' : 'active',
        applications: job.applications
      }))
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}