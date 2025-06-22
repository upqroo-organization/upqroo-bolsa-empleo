import { NextResponse } from 'next/server';
import { obtenerUsuarios, crearUsuario } from '@/services/usuario.service';

export async function GET() {
  const usuarios = await obtenerUsuarios();
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Aquí podrías agregar validación con Zod
  const nuevo = await crearUsuario(body);
  return NextResponse.json(nuevo);
}
