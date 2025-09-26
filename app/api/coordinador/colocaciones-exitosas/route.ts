import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    // Fetch successful placements (hired applications)
    const colocaciones = await prisma.application.findMany({
      where: {
        status: 'hired'
      },
      select: {
        id: true,
        hiredAt: true,
        appliedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            username: true,
          }
        },
        vacante: {
          select: {
            id: true,
            title: true,
            type: true,
            modality: true,
            location: true,
            salaryMin: true,
            salaryMax: true,
            career: true,
            department: true,
            company: {
              select: {
                id: true,
                name: true,
                industry: true,
                size: true,
              }
            }
          }
        }
      },
      orderBy: {
        hiredAt: 'desc'
      }
    })

    // Transform data to match the expected interface
    const colocacionesWithStats = colocaciones.map(colocacion => ({
      id: colocacion.id,
      student: {
        id: colocacion.user.id,
        name: colocacion.user.name || 'Sin nombre',
        email: colocacion.user.email || 'Sin email',
        image: colocacion.user.image,
        career: colocacion.vacante.career || 'No especificada',
        semester: 1, // This field doesn't exist in schema
      },
      company: {
        id: colocacion.vacante.company.id,
        name: colocacion.vacante.company.name,
        sector: colocacion.vacante.company.industry || 'No especificado',
        size: colocacion.vacante.company.size || 'No especificado',
      },
      vacante: {
        id: colocacion.vacante.id,
        title: colocacion.vacante.title,
        type: colocacion.vacante.type || 'No especificado',
        modality: colocacion.vacante.modality || 'No especificado',
        location: colocacion.vacante.location || 'No especificada',
        salaryMin: colocacion.vacante.salaryMin,
        salaryMax: colocacion.vacante.salaryMax,
      },
      hiredDate: colocacion.hiredAt?.toISOString() || colocacion.appliedAt.toISOString(),
      startDate: undefined, // You can add this field to the database if needed
      status: 'active', // You can add logic to determine actual status
      performance: Math.floor(Math.random() * 30) + 70, // Mock performance data, replace with real data
      notes: undefined, // You can add this field to the database if needed
    }))

    return NextResponse.json({
      success: true,
      data: colocacionesWithStats
    })

  } catch (error) {
    console.error('Error fetching colocaciones:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}