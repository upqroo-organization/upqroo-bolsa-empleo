import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'job-images');

async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verify the job belongs to the company
    const vacante = await prisma.vacante.findFirst({
      where: {
        id,
        companyId: session.user.id
      }
    });

    if (!vacante) {
      return NextResponse.json(
        { error: 'Vacante no encontrada o no autorizada' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validate file type (common image formats)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen (JPG, PNG, WebP)' },
        { status: 400 }
      );
    }

    // Validate file size (2MB for job images)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 2MB para imágenes de vacantes' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await ensureUploadsDir();

    // Delete existing image file if it exists
    if (vacante.imageUrl) {
      const existingFilePath = path.join(process.cwd(), vacante.imageUrl);
      try {
        if (existsSync(existingFilePath)) {
          await unlink(existingFilePath);
        }
      } catch (error) {
        console.warn('Could not delete existing job image file:', error);
      }
    }

    // Generate unique filename with proper extension
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `job_${id}_${timestamp}.${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const relativePath = `uploads/job-images/${fileName}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update vacante record with image URL
    const updatedVacante = await prisma.vacante.update({
      where: { id },
      data: { imageUrl: relativePath },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        state: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedVacante,
      message: 'Imagen subida correctamente',
    });

  } catch (error) {
    console.error('Error uploading job image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verify the job belongs to the company and get current image info
    const vacante = await prisma.vacante.findFirst({
      where: {
        id,
        companyId: session.user.id
      },
      select: { imageUrl: true }
    });

    if (!vacante) {
      return NextResponse.json(
        { error: 'Vacante no encontrada o no autorizada' },
        { status: 404 }
      );
    }

    if (!vacante.imageUrl) {
      return NextResponse.json(
        { error: 'No hay imagen para eliminar' },
        { status: 404 }
      );
    }

    // Delete the file
    const filePath = path.join(process.cwd(), vacante.imageUrl);
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.warn('Could not delete job image file:', error);
    }

    // Update vacante record to remove image URL
    const updatedVacante = await prisma.vacante.update({
      where: { id },
      data: { imageUrl: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        state: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedVacante,
      message: 'Imagen eliminada correctamente',
    });

  } catch (error) {
    console.error('Error deleting job image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}