import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const coordinator = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: 'Coordinador no encontrado' },
        { status: 404 }
      );
    }

    // Check if event exists and belongs to coordinator
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: params.id,
        coordinatorId: coordinator.id
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No se encontró archivo de imagen' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Tipo de archivo no permitido' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'El archivo es demasiado grande (máximo 5MB)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `event_${params.id}_${timestamp}${extension}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Update event with image URL
    const imageUrl = `/uploads/events/${filename}`;
    await prisma.event.update({
      where: { id: params.id },
      data: { imageUrl }
    });

    return NextResponse.json({
      success: true,
      data: { imageUrl },
      message: 'Imagen subida exitosamente'
    });

  } catch (error) {
    console.error('Error uploading event image:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}