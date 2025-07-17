import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';

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
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        isApprove: isApproved,
      },
    });

    // Send notification email to company
    try {
      await sendEmail({
        to: company.email,
        subject: isApproved 
          ? 'Tu empresa ha sido aprobada - Bolsa de Trabajo UPQROO' 
          : 'Actualización sobre tu solicitud - Bolsa de Trabajo UPQROO',
        html: isApproved
          ? `
            <h1>¡Felicidades! Tu empresa ha sido aprobada</h1>
            <p>Estimado(a) ${company.contactName || company.name},</p>
            <p>Nos complace informarte que tu empresa <strong>${company.name}</strong> ha sido aprobada en la Bolsa de Trabajo de la Universidad Politécnica de Quintana Roo.</p>
            <p>Ahora puedes acceder a la plataforma y comenzar a publicar vacantes para nuestros estudiantes y egresados.</p>
            ${comments ? `<p><strong>Comentarios del coordinador:</strong> ${comments}</p>` : ''}
            <p>Accede a tu cuenta en: <a href="${process.env.NEXTAUTH_URL}/login">Bolsa de Trabajo UPQROO</a></p>
            <p>Saludos cordiales,<br>Equipo de Coordinación<br>Universidad Politécnica de Quintana Roo</p>
          `
          : `
            <h1>Actualización sobre tu solicitud</h1>
            <p>Estimado(a) ${company.contactName || company.name},</p>
            <p>Hemos revisado la información de tu empresa <strong>${company.name}</strong> y lamentamos informarte que no podemos aprobar tu solicitud en este momento.</p>
            ${comments ? `<p><strong>Motivo:</strong> ${comments}</p>` : ''}
            <p>Si deseas más información o quieres volver a enviar tu solicitud con la información actualizada, por favor contáctanos a través de coordinacion@upqroo.edu.mx</p>
            <p>Saludos cordiales,<br>Equipo de Coordinación<br>Universidad Politécnica de Quintana Roo</p>
          `
      });
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