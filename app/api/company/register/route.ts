// Ejemplo: /app/api/register-empresa/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // Verifica si ya existe
  const existing = await prisma.company.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Ya existe una empresa con ese correo" }, { status: 400 });
  }

  // Hashea la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.company.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ success: true });
}
