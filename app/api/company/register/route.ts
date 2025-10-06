import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      state,
      phone,
      rfc,
      sector,
      direccion,
      description,
      contactName,
      contactPosition,
      companyType
    } = await req.json();

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
        companyType: companyType,
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

    return NextResponse.json({
      success: true,
      message: "Empresa registrada exitosamente. Tu cuenta será revisada por el equipo de coordinación.",
      company: {
        id: newCompany.id,
        name: newCompany.name,
        email: newCompany.email,
        isApprove: newCompany.isApprove
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
