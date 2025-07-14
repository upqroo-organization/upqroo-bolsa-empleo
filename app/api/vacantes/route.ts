import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || undefined
  const type = searchParams.getAll('type[]') || []
  const modality = searchParams.getAll('modality[]') || []
  const department = searchParams.get('department') || undefined
  const career = searchParams.get('career') || undefined
  const state = searchParams.get('state') || undefined
  const isMock = searchParams.get('isMock') === 'true' ? true : undefined

  const offset = parseInt(searchParams.get('offset') || '0', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  const filters: Record<string, unknown> = {
    title: title ? { contains: title } : undefined,
    department,
    career,
    isMock,
    state: !Number.isNaN(Number(state)) ? { id: Number(state) } : undefined
  }

  if (type.length > 0) {
    filters.type = { in: type }
  }

  if (modality.length > 0) {
    filters.modality = { in: modality }
  }

  try {
    // total count
    const total = await prisma.vacante.count({
      where: filters
    })

    // paginated data
    const vacantes = await prisma.vacante.findMany({
      where: filters,
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
         state: {
          select: {
            name: true,
            id: true
          }
         }
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    })

    return NextResponse.json({
      total,
      data: vacantes
    })
  } catch (error) {
    console.error('Error al obtener vacantes:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Ocurrió un error al obtener las vacantes' }),
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      title,
      summary,
      description,
      responsibilities,
      location,
      salaryMin,
      salaryMax,
      department,
      type,
      modality,
      numberOfPositions,
      companyId,
      isMock,
      applicationProcess,
      deadline,
      state
    } = data

    if (!title || !summary || !description || !responsibilities || !companyId) {
      console.log(data)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newVacante = await prisma.vacante.create({
      data: {
        title,
        summary,
        description,
        responsibilities,
        location,
        salaryMin,
        salaryMax,
        department,
        type,
        modality,
        numberOfPositions,
        isMock: isMock ?? false,
        applicationProcess,
        deadline: deadline ? new Date(deadline) : undefined,
        state: {
          connect: { id: state }
        },
        company: {
          connect: { id: companyId }
        }
      },
    })

    return NextResponse.json(newVacante, { status: 201 })
  } catch (error) {
    console.error('Error creating vacante:', error)
    console.log(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
