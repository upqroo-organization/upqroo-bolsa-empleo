import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { emailHelpers } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const companyId = params.id;
    const { action, comments } = await request.json();

    // Validate action
    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      );
    }

    // Find the company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    // Update company approval status
    const isApproved = action === 'approve';
    const approvalStatus = action === 'approve' ? 'approved' : 'rejected';
    
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        isApprove: isApproved,
        approvalStatus: approvalStatus,
      },
    });

    // Send notification email to company
    try {
      if (isApproved) {
        await emailHelpers.sendCompanyApprovalEmail(
          company.email,
          company.name,
          company.contactName || undefined,
          comments || undefined
        );
      } else {
        await emailHelpers.sendCompanyRejectionEmail(
          company.email,
          company.name,
          company.contactName || undefined,
          comments || undefined
        );
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Continue with the process even if email fails
    }

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: isApproved 
        ? 'Empresa aprobada correctamente' 
        : 'Empresa rechazada correctamente',
    });
  } catch (error) {
    console.error('Error updating company approval status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}