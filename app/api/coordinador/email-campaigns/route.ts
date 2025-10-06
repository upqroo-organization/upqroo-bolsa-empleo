import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmailDirect } from '@/lib/emailService';
import { COMPANY_REGISTER_INVITATION } from './email-template';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get all approved companies
    const companies = await prisma.company.findMany({
      where: {
        approvalStatus: 'approved'
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactName: true,
        industry: true,
        state: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        companies,
        totalCompanies: companies.length
      }
    });
  } catch (error) {
    console.error('Error fetching companies for email campaign:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { subject, message, template, templateData, companyIds, customEmails } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Asunto y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Get companies to send emails to
    const companies = await prisma.company.findMany({
      where: {
        id: { in: companyIds || [] },
        approvalStatus: 'approved'
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactName: true
      }
    });

    // Validate that we have at least one recipient
    const totalRecipients = companies.length + (customEmails?.length || 0);
    if (totalRecipients === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos un destinatario' },
        { status: 400 }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Send emails to all companies
    for (const company of companies) {
      try {
        const emailData = {
          companyName: company.name,
          contactName: company.contactName || 'Estimado/a',
          ...templateData
        };

        const emailOptions = template && template !== "none" ? {
          to: company.email,
          subject: subject,
          template,
          templateData: emailData,
          // Provide fallback content in case template doesn't exist
          html: COMPANY_REGISTER_INVITATION,
          text: `${subject}\n\nEstimado/a ${company.contactName || 'representante de ' + company.name},\n\n${message}\n\nSaludos cordiales,\nEquipo de Coordinación\nUniversidad Politécnica de Quintana Roo`
        } : {
          to: company.email,
          subject: subject,
          html: COMPANY_REGISTER_INVITATION,
          text: `${subject}\n\nEstimado/a ${company.contactName || 'representante de ' + company.name},\n\n${message}\n\nSaludos cordiales,\nEquipo de Coordinación\nUniversidad Politécnica de Quintana Roo`
        };

        const result = await sendEmailDirect(emailOptions);

        if (result.success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`${company.name}: ${result.error}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${company.name}: Error al enviar correo`);
      }
    }

    // Send emails to custom email addresses
    if (customEmails && customEmails.length > 0) {
      for (const customEmail of customEmails) {
        try {
          const emailData = {
            companyName: customEmail.name,
            contactName: customEmail.name,
            ...templateData
          };

          const emailOptions = template && template !== "none" ? {
            to: customEmail.email,
            subject: subject,
            template,
            templateData: emailData,
            // Provide fallback content in case template doesn't exist
            html: COMPANY_REGISTER_INVITATION,
            text: `${subject}\n\nEstimado/a ${customEmail.name},\n\n${message}\n\nSaludos cordiales,\nEquipo de Coordinación\nUniversidad Politécnica de Quintana Roo`
          } : {
            to: customEmail.email,
            subject: subject,
            html: COMPANY_REGISTER_INVITATION,
            text: `${subject}\n\nEstimado/a ${customEmail.name},\n\n${message}\n\nSaludos cordiales,\nEquipo de Coordinación\nUniversidad Politécnica de Quintana Roo`
          };

          const result = await sendEmailDirect(emailOptions);

          if (result.success) {
            results.sent++;
          } else {
            results.failed++;
            results.errors.push(`${customEmail.name} (${customEmail.email}): ${result.error}`);
          }
        } catch (error) {
          results.failed++;
          results.errors.push(`${customEmail.name} (${customEmail.email}): Error al enviar correo`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCompanies: companies.length,
        totalCustomEmails: customEmails?.length || 0,
        sent: results.sent,
        failed: results.failed,
        errors: results.errors
      }
    });
  } catch (error) {
    console.error('Error sending email campaign:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}