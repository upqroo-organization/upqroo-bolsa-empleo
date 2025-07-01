// app/api/vacantes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      experienceLevel,
      numberOfPositions,
      companyId,
      isMock,
      applicationProcess,
      deadline,
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
        experienceLevel,
        numberOfPositions,
        companyId,
        isMock: isMock ?? false,
        applicationProcess,
        deadline: deadline ? new Date(deadline) : undefined,
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
