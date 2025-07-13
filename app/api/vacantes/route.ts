// app/api/vacantes/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || undefined
  const type = searchParams.get('type') || undefined
  const modality = searchParams.get('modality') || undefined
  const department = searchParams.get('department') || undefined
  const career = searchParams.get('career') || undefined
  const isMock = searchParams.get('isMock') === 'true' ? true : undefined

  const offset = parseInt(searchParams.get('offset') || '0', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  const filters = {
    title: title ? { contains: title } : undefined,
    type,
    modality,
    department,
    career,
    isMock,
  }

  try {
    // primero el conteo total con filtros
    const total = await prisma.vacante.count({ where: filters })

    // ahora la lista paginada
    const vacantes = await prisma.vacante.findMany({
      where: filters,
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
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
