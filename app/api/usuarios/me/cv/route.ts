import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'cvs');

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
    const file = formData.get('cv') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Solo se permiten archivos PDF' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await ensureUploadsDir();

    // Get current user to check if they have an existing CV
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { cvUrl: true }
    });

    // Delete existing CV file if it exists
    if (currentUser?.cvUrl) {
      const existingFilePath = path.join(process.cwd(), currentUser.cvUrl);
      try {
        if (existsSync(existingFilePath)) {
          await unlink(existingFilePath);
        }
      } catch (error) {
        console.warn('Could not delete existing CV file:', error);
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `cv_${session.user.id}_${timestamp}.pdf`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const relativePath = `uploads/cvs/${fileName}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update user record with CV URL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { cvUrl: relativePath },
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
      message: 'CV subido correctamente',
    });

  } catch (error) {
    console.error('Error uploading CV:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get current user CV info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { cvUrl: true }
    });

    if (!currentUser?.cvUrl) {
      return NextResponse.json(
        { error: 'No tienes un CV para eliminar' },
        { status: 404 }
      );
    }

    // Delete the file
    const filePath = path.join(process.cwd(), currentUser.cvUrl);
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.warn('Could not delete CV file:', error);
    }

    // Update user record to remove CV URL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { cvUrl: null },
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
      message: 'CV eliminado correctamente',
    });

  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}