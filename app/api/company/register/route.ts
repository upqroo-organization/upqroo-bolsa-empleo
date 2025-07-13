import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, state } = await req.json();

  if(!name || !email || !password || !state) {
    return NextResponse.json(
      { error: "missing data" },
      { status: 400 }
    );
  }

  // Verifica si ya existe
  const existing = await prisma.company.findUnique({ where: { email } });
  const defaultRole = await prisma.role.findUnique({
    where: { name: "company" },
  });
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
      state: {
        connect: { id: state }
      }, // Ajusta el valor según los valores permitidos en tu modelo Prisma
      role: {
        connect: { id: defaultRole?.id || "" }, // Asegura que el rol se asigne correctamente
      },
    },
  });

  return NextResponse.json({ success: true });
}
