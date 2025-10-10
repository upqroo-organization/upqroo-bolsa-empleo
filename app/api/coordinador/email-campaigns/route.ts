import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmailDirect } from '@/lib/emailService';
import { COMPANY_REGISTER_INVITATION, EmpresasApiResponse } from './email-template';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get all approved companies from database
    const internalCompanies = await prisma.company.findMany({
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

    // Fetch external companies from API
    let externalCompanies: Array<{
      id: string;
      name: string;
      email: string;
      contactName: string | null;
      industry: string | null;
      state: { name: string } | null;
      isExternal: boolean;
    }> = [];

    try {
      const response = await fetch(process.env.EMPRESAS_API!);
      if (response.ok) {
        const apiCompanies: EmpresasApiResponse = await response.json();
        externalCompanies = apiCompanies.map(company => ({
          id: `external_${company.id_empresa}`,
          name: company.empresa_nombre,
          email: company.empresa_email,
          contactName: null, // External API doesn't provide contact names
          industry: company.empresa_tamano, // Using company size as industry
          state: null, // External API doesn't provide state info
          isExternal: true
        }));
      }
    } catch (error) {
      console.warn('Error fetching external companies:', error);
      // Continue without external companies if API fails
    }

    // Combine internal and external companies
    const allCompanies = [
      ...internalCompanies.map(company => ({ ...company, isExternal: false })),
      ...externalCompanies
    ].sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      data: {
        companies: allCompanies,
        totalCompanies: allCompanies.length,
        internalCount: internalCompanies.length,
        externalCount: externalCompanies.length
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

    const { companyIds, customEmails, templateData } = await request.json();

    // Separate internal and external company IDs
    const internalCompanyIds = (companyIds || []).filter((id: string) => !id.startsWith('external_'));
    const externalCompanyIds = (companyIds || []).filter((id: string) => id.startsWith('external_'));

    // Get internal companies from database
    const internalCompanies = await prisma.company.findMany({
      where: {
        id: { in: internalCompanyIds },
        approvalStatus: 'approved'
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactName: true
      }
    });

    // Get external companies from API
    let externalCompanies: Array<{
      id: string;
      name: string;
      email: string;
      contactName: string | null;
    }> = [];

    if (externalCompanyIds.length > 0) {
      try {
        const response = await fetch(process.env.EMPRESAS_API!);
        if (response.ok) {
          const apiCompanies: EmpresasApiResponse = await response.json();
          const selectedExternalIds = externalCompanyIds.map(id => parseInt(id.replace('external_', '')));

          externalCompanies = apiCompanies
            .filter(company => selectedExternalIds.includes(company.id_empresa))
            .map(company => ({
              id: `external_${company.id_empresa}`,
              name: company.empresa_nombre,
              email: company.empresa_email,
              contactName: null
            }));
        }
      } catch (error) {
        console.warn('Error fetching external companies for sending:', error);
      }
    }

    // Combine all companies
    const companies = [...internalCompanies, ...externalCompanies];

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

    // Prepare the template with replacements
    const prepareTemplate = (companyName: string, contactName: string) => {
      let template = COMPANY_REGISTER_INVITATION;

      // Replace template variables with form data or company data
      const finalContactName = templateData?.contactName || contactName || 'Estimado/a';

      template = template.replace(/{{Nombre del representante \/ Empresa}}/g, finalContactName);
      template = template.replace(/{{UNIVERSIDAD}}/g, 'Universidad Politécnica de Quintana Roo');

      return template;
    };

    // Send emails to all companies
    for (const company of companies) {
      try {
        const emailOptions = {
          to: company.email,
          subject: 'Invitación a registrarse en la Bolsa de Trabajo Universitaria de UPQROO',
          html: prepareTemplate(company.name, company.contactName || ''),
          text: `Invitación a registrarse en la Bolsa de Trabajo Universitaria de UPQROO\n\nEstimado/a ${company.contactName || 'representante de ' + company.name},\n\nLa Universidad Politécnica de Quintana Roo le invita cordialmente a registrar su empresa en nuestra Bolsa de Trabajo Universitaria.\n\nSaludos cordiales,\nEquipo de Coordinación\nUniversidad Politécnica de Quintana Roo`
        };

        const result = await sendEmailDirect(emailOptions);

        if (result.success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`${company.name}: ${result.error}`);
        }
      } catch {
        results.failed++;
        results.errors.push(`${company.name}: Error al enviar correo`);
      }
    }

    // Send emails to custom email addresses
    if (customEmails && customEmails.length > 0) {
      for (const customEmail of customEmails) {
        try {
          const emailOptions = {
            to: customEmail.email,
            subject: 'Invitación a registrarse en la Bolsa de Trabajo Universitaria de UPQROO',
            html: prepareTemplate(customEmail.name, customEmail.name),
            text: `Invitación a registrarse en la Bolsa de Trabajo Universitaria de UPQROO\n\nEstimado/a ${customEmail.name},\n\nLa Universidad Politécnica de Quintana Roo le invita cordialmente a registrar su empresa en nuestra Bolsa de Trabajo Universitaria.\n\nSaludos cordiales,\nEquipo de Coordinación\nUniversidad Politécnica de Quintana Roo`
          };

          const result = await sendEmailDirect(emailOptions);

          if (result.success) {
            results.sent++;
          } else {
            results.failed++;
            results.errors.push(`${customEmail.name} (${customEmail.email}): ${result.error}`);
          }
        } catch {
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