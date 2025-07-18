import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const vacante = await prisma.vacante.findUnique({
      where: {
        id: id
      },
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
      }
    })

    if (!vacante) {
      return NextResponse.json(
        { error: 'Vacante not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(vacante)
  } catch (error) {
    console.error('Error al obtener vacante:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}