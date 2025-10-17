import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vacanteId } = await params

    // Verificar que la vacante existe
    const vacante = await prisma.vacante.findUnique({
      where: { id: vacanteId }
    })

    if (!vacante) {
      return NextResponse.json(
        { success: false, error: "Vacante no encontrada" },
        { status: 404 }
      )
    }

    // Obtener los postulantes de la vacante
    const postulantes = await prisma.application.findMany({
      where: {
        vacanteId: vacanteId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            career: true,
            cvUrl: true,
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    })

    // Formatear los datos para el frontend
    const formattedPostulantes = postulantes.map(application => ({
      id: application.id,
      user: {
        name: application.user.name || 'Sin nombre',
        email: application.user.email,
        cvUrl: application.user.cvUrl,
      },
      status: application.status,
      appliedDate: application.appliedAt.toISOString(),
      cvUrl: application.user.cvUrl,
      career: application.user.career,
    }))

    return NextResponse.json({
      success: true,
      data: formattedPostulantes
    })

  } catch (error) {
    console.error("Error fetching postulantes:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}