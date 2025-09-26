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

    // Fetch approved companies with their statistics
    const companies = await prisma.company.findMany({
      where: {
        isApprove: true,
        approvalStatus: 'approved'
      },
      select: {
        id: true,
        name: true,
        email: true,
        industry: true,
        size: true,
        city: true,
        country: true,
        address: true,
        phone: true,
        websiteUrl: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        fiscalDocumentUrl: true,
        contactName: true,
        contactEmail: true,
        contactPhone: true,
        state: {
          select: {
            name: true
          }
        },
        vacantes: {
          select: {
            id: true,
            applications: {
              select: {
                id: true,
                status: true,
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Transform data to include statistics
    const companiesWithStats = companies.map(company => ({
      id: company.id,
      name: company.name,
      email: company.email,
      sector: company.industry || 'No especificado',
      size: company.size || 'No especificado',
      location: `${company.city || ''}, ${company.state?.name || company.country || ''}`.trim().replace(/^,\s*/, '') || 'No especificada',
      phone: company.phone,
      website: company.websiteUrl,
      description: company.description,
      approvedDate: company.updatedAt.toISOString(),
      status: 'approved',
      fiscalDocumentUrl: company.fiscalDocumentUrl,
      contactName: company.contactName,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      vacantesCount: company.vacantes.length,
      applicationsCount: company.vacantes.reduce((sum, vacante) => sum + vacante.applications.length, 0),
      hiresCount: company.vacantes.reduce((sum, vacante) => 
        sum + vacante.applications.filter(app => app.status === 'hired').length, 0
      ),
    }))

    return NextResponse.json({
      success: true,
      data: companiesWithStats
    })

  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}