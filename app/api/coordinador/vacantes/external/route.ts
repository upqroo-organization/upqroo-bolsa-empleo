import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Check if user is coordinator from session
    if (session.user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'Solo coordinadores pueden crear vacantes externas' },
        { status: 403 }
      )
    }

    // Get coordinator user
    const coordinator = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!coordinator) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const data = await req.json()
    const {
      title,
      summary,
      description,
      responsibilities,
      externalCompanyName,
      externalCompanyEmail,
      externalCompanyPhone,
      imageUrl,
      isImageOnly,
      location,
      career,
      type,
      modality,
      deadline,
      stateId
    } = data

    // Validate required fields
    if (!title || !externalCompanyName) {
      return NextResponse.json(
        { error: 'El título y nombre de empresa son requeridos' },
        { status: 400 }
      )
    }

    // For image-only vacantes, only require imageUrl
    if (isImageOnly && !imageUrl) {
      return NextResponse.json(
        { error: 'La imagen es requerida para vacantes de solo imagen' },
        { status: 400 }
      )
    }

    // For regular vacantes, require description fields
    if (!isImageOnly && (!summary || !description || !responsibilities)) {
      return NextResponse.json(
        { error: 'Resumen, descripción y responsabilidades son requeridos' },
        { status: 400 }
      )
    }

    const newVacante = await prisma.vacante.create({
      data: {
        title,
        summary: summary || 'Ver imagen para más detalles',
        description: description || 'Ver imagen para más detalles',
        responsibilities: responsibilities || 'Ver imagen para más detalles',
        isExternal: true,
        isImageOnly: isImageOnly || false,
        externalCompanyName,
        externalCompanyEmail,
        externalCompanyPhone,
        imageUrl,
        location,
        career,
        type,
        modality,
        deadline: deadline ? new Date(deadline) : undefined,
        createdByCoordinatorId: coordinator.id,
        stateId: stateId ? parseInt(stateId) : undefined,
        // No companyId since it's external
        companyId: null
      },
      include: {
        createdByCoordinator: {
          select: {
            name: true,
            email: true
          }
        },
        state: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newVacante,
      message: 'Vacante externa creada correctamente'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating external vacante:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET endpoint to list external vacantes
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const total = await prisma.vacante.count({
      where: { isExternal: true }
    })

    const vacantes = await prisma.vacante.findMany({
      where: { isExternal: true },
      include: {
        createdByCoordinator: {
          select: {
            name: true,
            email: true
          }
        },
        state: {
          select: {
            name: true,
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    return NextResponse.json({
      total,
      data: vacantes
    })
  } catch (error) {
    console.error('Error fetching external vacantes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
