import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Fetch company data
    const company = await prisma.company.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
    });

  } catch (error) {
    console.error('Error fetching company data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate and sanitize the input data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    // Basic company information
    if (body.name) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl || null;
    if (body.websiteUrl !== undefined) updateData.websiteUrl = body.websiteUrl || null;
    if (body.rfc) updateData.rfc = body.rfc;

    // Location information
    if (body.city !== undefined) updateData.city = body.city || null;
    if (body.country !== undefined) updateData.country = body.country || null;
    if (body.address !== undefined) updateData.address = body.address || null;
    if (body.zipCode !== undefined) updateData.zipCode = body.zipCode || null;
    if (body.phone !== undefined) updateData.phone = body.phone || null;

    // Company details
    if (body.fundationDate !== undefined) {
      updateData.fundationDate = body.fundationDate ? new Date(body.fundationDate) : null;
    }
    if (body.industry !== undefined) updateData.industry = body.industry || null;
    if (body.organizationCulture !== undefined) updateData.organizationCulture = body.organizationCulture || null;
    if (body.size !== undefined) updateData.size = body.size || null;

    // Contact person information
    if (body.contactName !== undefined) updateData.contactName = body.contactName || null;
    if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail || null;
    if (body.contactPhone !== undefined) updateData.contactPhone = body.contactPhone || null;
    if (body.contactPosition !== undefined) updateData.contactPosition = body.contactPosition || null;
    if (body.companyRole !== undefined) updateData.companyRole = body.companyRole || null;

    // State relationship
    if (body.stateId !== undefined) {
      updateData.stateId = body.stateId ? parseInt(body.stateId) : null;
    }

    // Fiscal document
    if (body.fiscalDocumentUrl !== undefined) {
      updateData.fiscalDocumentUrl = body.fiscalDocumentUrl || null;
    }

    // Update the company
    const updatedCompany = await prisma.company.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: 'Perfil actualizado exitosamente',
    });

  } catch (error) {
    console.error('Error updating company data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}