import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    // Fetch all vacantes with their statistics
    const vacantes = await prisma.vacante.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        modality: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        status: true,
        createdAt: true,
        deadline: true,
        career: true,
        department: true,
        numberOfPositions: true,
        state: {
          select: {
            name: true
          }
        },
        company: {
          select: {
            name: true,
            industry: true,
          }
        },
        applications: {
          select: {
            id: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to include statistics
    const vacantesWithStats = vacantes.map(vacante => ({
      id: vacante.id,
      title: vacante.title,
      company: {
        name: vacante.company.name,
        sector: vacante.company.industry || 'No especificado',
      },
      type: vacante.type || 'No especificado',
      modality: vacante.modality || 'No especificado',
      location: vacante.location || 'No especificada',
      salaryMin: vacante.salaryMin,
      salaryMax: vacante.salaryMax,
      status: vacante.status,
      createdDate: vacante.createdAt.toISOString(),
      deadline: vacante.deadline?.toISOString(),
      career: vacante.career,
      department: vacante.department,
      numberOfPositions: vacante.numberOfPositions,
      state: vacante.state?.name,
      applicationsCount: vacante.applications.length,
      interviewsCount: vacante.applications.filter(app => app.status === 'interview').length,
      hiresCount: vacante.applications.filter(app => app.status === 'hired').length,
    }))

    return NextResponse.json({
      success: true,
      data: vacantesWithStats
    })

  } catch (error) {
    console.error('Error fetching vacantes:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}