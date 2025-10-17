import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const state = formData.get('state') as string;
    const phone = formData.get('phone') as string;
    const rfc = formData.get('rfc') as string;
    const sector = formData.get('sector') as string;
    const size = formData.get('size') as string;
    const website = formData.get('website') as string;
    const direccion = formData.get('direccion') as string;
    const description = formData.get('description') as string;
    const contactName = formData.get('contactName') as string;
    const contactPosition = formData.get('contactPosition') as string;
    const companyType = formData.get('companyType') as string;
    const fiscalDocument = formData.get('fiscalDocument') as File;

    // Validate required fields
    if (!name || !email || !password || !state || !size || !companyType) {
      return NextResponse.json(
        { error: "Faltan datos requeridos: nombre, email, contraseña, estado, tamaño de empresa y tipo de sociedad" },
        { status: 400 }
      );
    }

    // Check if company already exists
    const existing = await prisma.company.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una empresa con ese correo electrónico" },
        { status: 400 }
      );
    }

    // Check if RFC already exists (if provided)
    if (rfc) {
      const existingRFC = await prisma.company.findUnique({ where: { rfc } });
      if (existingRFC) {
        return NextResponse.json(
          { error: "Ya existe una empresa con ese RFC" },
          { status: 400 }
        );
      }
    }

    // Get company role
    const companyRole = await prisma.role.findUnique({
      where: { name: "company" },
    });

    if (!companyRole) {
      return NextResponse.json(
        { error: "Error de configuración: rol de empresa no encontrado" },
        { status: 500 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company with all provided data
    const newCompany = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
        rfc: rfc || null,
        phone: phone || null,
        industry: sector || null,
        size: size,
        companyType: companyType,
        websiteUrl: website || null,
        address: direccion || null,
        description: description || null,
        contactName: contactName || null,
        contactPosition: contactPosition || null,
        contactEmail: email, // Use company email as contact email
        isApprove: false, // Companies start as unapproved
        roleId: companyRole.id,
        stateId: state ? parseInt(state) : null,
      },
      include: {
        state: true,
        role: true
      }
    });

    // Handle fiscal document upload if provided
    let fiscalDocumentUrl = null;
    if (fiscalDocument && fiscalDocument.size > 0) {
      try {
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(fiscalDocument.type)) {
          // Delete the created company if file upload fails
          await prisma.company.delete({ where: { id: newCompany.id } });
          return NextResponse.json(
            { error: "Tipo de archivo no válido. Solo se permiten PDF, JPG, PNG o WEBP" },
            { status: 400 }
          );
        }

        // Validate file size (10MB)
        if (fiscalDocument.size > 10 * 1024 * 1024) {
          // Delete the created company if file upload fails
          await prisma.company.delete({ where: { id: newCompany.id } });
          return NextResponse.json(
            { error: "El archivo es demasiado grande. Máximo 10MB" },
            { status: 400 }
          );
        }

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'fiscal-documents');
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const fileExtension = fiscalDocument.name.split('.').pop();
        const fileName = `fiscal_${newCompany.id}_${Date.now()}.${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Convert file to buffer and save
        const bytes = await fiscalDocument.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Update company with fiscal document URL
        fiscalDocumentUrl = `uploads/fiscal-documents/${fileName}`;
        await prisma.company.update({
          where: { id: newCompany.id },
          data: { fiscalDocumentUrl }
        });

      } catch (fileError) {
        console.error('Error uploading fiscal document:', fileError);
        // Don't delete the company, just log the error
        // The company can upload the document later from their profile
      }
    }

    return NextResponse.json({
      success: true,
      message: fiscalDocument
        ? "Empresa registrada exitosamente con constancia fiscal. Tu cuenta será revisada por el equipo de coordinación."
        : "Empresa registrada exitosamente. Tu cuenta será revisada por el equipo de coordinación.",
      company: {
        id: newCompany.id,
        name: newCompany.name,
        email: newCompany.email,
        isApprove: newCompany.isApprove,
        fiscalDocumentUploaded: !!fiscalDocumentUrl
      }
    });

  } catch (error) {
    console.error('Error registering company:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
