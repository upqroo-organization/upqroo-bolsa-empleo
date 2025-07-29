import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          error: 'No autorizado',
          details: 'Debes iniciar sesión para acceder al dashboard'
        },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get user applications with related data
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        vacante: {
          include: {
            company: {
              select: {
                name: true,
                logoUrl: true
              }
            },
            state: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      take: 10 // Limit to recent applications
    })

    // Calculate application statistics
    const applicationStats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      interview: applications.filter(app => app.status === 'interview').length,
      hired: applications.filter(app => app.status === 'hired').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    }

    // Get recommended jobs (jobs user hasn't applied to)
    const recommendedJobs = await prisma.vacante.findMany({
      where: {
        NOT: {
          applications: {
            some: {
              userId: userId
            }
          }
        }
      },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true
          }
        },
        state: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5 // Limit recommendations
    })

    // Calculate profile completion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        cvUrl: true,
        image: true,
        role: true,
      }
    })

    let profileCompletion = 0
    if (user?.name) profileCompletion += 25
    if (user?.email) profileCompletion += 25
    if (user?.cvUrl) profileCompletion += 30
    if (user?.image) profileCompletion += 20

    // Get recent applications for the timeline (last 5)
    const recentApplications = applications.slice(0, 5)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          profileCompletion
        },
        statistics: {
          applications: applicationStats.total,
          interviews: applicationStats.interview,
          profileCompletion: `${profileCompletion}%`
        },
        recentApplications: recentApplications.map(app => ({
          id: app.id,
          title: app.vacante.title,
          company: app.vacante.company.name,
          companyLogo: app.vacante.company.logoUrl,
          status: app.status,
          appliedAt: app.appliedAt,
          location: app.vacante.location,
          state: app.vacante.state?.name
        })),
        recommendedJobs: recommendedJobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company.name,
          companyLogo: job.company.logoUrl,
          location: job.location,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          type: job.type,
          modality: job.modality,
          state: job.state?.name,
          applicationsCount: job._count.applications,
          createdAt: job.createdAt
        })),
        applicationStats
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: 'No se pudo cargar la información del dashboard'
      },
      { status: 500 }
    )
  }
}