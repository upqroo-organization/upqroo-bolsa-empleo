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

    // Fetch active students with their application statistics
    const students = await prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ['student', 'external'] // Both students and external users
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        cvUrl: true,
        createdAt: true,
        role: {
          select: {
            name: true
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
    const studentsWithStats = students.map(student => ({
      id: student.id,
      name: student.name || 'Sin nombre',
      email: student.email || 'Sin email',
      image: student.image,
      career: 'No especificada', // This field doesn't exist in schema, you may need to add it
      semester: 1, // This field doesn't exist in schema, you may need to add it
      registrationDate: student.createdAt.toISOString(),
      status: 'active',
      phone: null, // This field doesn't exist in schema
      location: null, // This field doesn't exist in schema
      cvUrl: student.cvUrl,
      applicationsCount: student.applications.length,
      interviewsCount: student.applications.filter(app => app.status === 'interview').length,
      hiredCount: student.applications.filter(app => app.status === 'hired').length,
    }))

    return NextResponse.json({
      success: true,
      data: studentsWithStats
    })

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}