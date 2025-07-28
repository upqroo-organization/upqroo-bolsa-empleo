import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'photos');

async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validate file type (JPG, PNG, WEBP)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos JPG, PNG o WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 2MB' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await ensureUploadsDir();

    // Get current user to check if they have an existing photo
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    // Delete existing photo file if it exists and it's a local file
    if (currentUser?.image && currentUser.image.startsWith('uploads/photos/')) {
      const existingFilePath = path.join(process.cwd(), currentUser.image);
      try {
        if (existsSync(existingFilePath)) {
          await unlink(existingFilePath);
        }
      } catch (error) {
        console.warn('Could not delete existing photo file:', error);
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `photo_${session.user.id}_${timestamp}.${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const relativePath = `uploads/photos/${fileName}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update user record with photo URL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: relativePath },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        cvUrl: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Foto de perfil subida correctamente',
    });

  } catch (error) {
    console.error('Error uploading profile photo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get current user photo info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    if (!currentUser?.image) {
      return NextResponse.json(
        { error: 'No tienes una foto de perfil para eliminar' },
        { status: 404 }
      );
    }

    // Only delete if it's a local file (not from OAuth providers)
    if (currentUser.image.startsWith('uploads/photos/')) {
      const filePath = path.join(process.cwd(), currentUser.image);
      try {
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.warn('Could not delete photo file:', error);
      }
    }

    // Update user record to remove photo URL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        cvUrl: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Foto de perfil eliminada correctamente',
    });

  } catch (error) {
    console.error('Error deleting profile photo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}