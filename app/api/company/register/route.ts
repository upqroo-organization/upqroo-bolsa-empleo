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
    if (!name || !email || !password || !state) {
      return NextResponse.json(
        { error: "Faltan datos requeridos: nombre, email, contraseña y estado" },
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
        address: direccion || null,
        description: description || null,
        contactName: contactName || null,
        contactPosition: contactPosition || null,
        companyType: companyType,
        contactEmail: email, // Use company email as contact email
        isApprove: false, // Companies start as unapproved
        state: {
          connect: { id: state }
        },
        role: {
          connect: { id: companyRole.id }
        },
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
