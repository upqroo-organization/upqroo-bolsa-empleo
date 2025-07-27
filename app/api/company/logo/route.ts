import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'logos');

async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('logo') as File;

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
      'image/webp',
      'image/svg+xml'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen (JPG, PNG, WebP, SVG)' },
        { status: 400 }
      );
    }

    // Validate file size (1MB for logos)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 1MB para logos' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await ensureUploadsDir();

    // Get current company to check if they have an existing logo
    const currentCompany = await prisma.company.findUnique({
      where: { id: session.user.id },
      select: { logoUrl: true }
    });

    // Delete existing logo file if it exists
    if (currentCompany?.logoUrl) {
      const existingFilePath = path.join(process.cwd(), currentCompany.logoUrl);
      try {
        if (existsSync(existingFilePath)) {
          await unlink(existingFilePath);
        }
      } catch (error) {
        console.warn('Could not delete existing logo file:', error);
      }
    }

    // Generate unique filename with proper extension
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `logo_${session.user.id}_${timestamp}.${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const relativePath = `uploads/logos/${fileName}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update company record with logo URL
    const updatedCompany = await prisma.company.update({
      where: { id: session.user.id },
      data: { logoUrl: relativePath },
      include: {
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
      data: updatedCompany,
      message: 'Logo subido correctamente',
    });

  } catch (error) {
    console.error('Error uploading logo:', error);
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

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get current company logo info
    const currentCompany = await prisma.company.findUnique({
      where: { id: session.user.id },
      select: { logoUrl: true }
    });

    if (!currentCompany?.logoUrl) {
      return NextResponse.json(
        { error: 'No tienes un logo para eliminar' },
        { status: 404 }
      );
    }

    // Delete the file
    const filePath = path.join(process.cwd(), currentCompany.logoUrl);
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.warn('Could not delete logo file:', error);
    }

    // Update company record to remove logo URL
    const updatedCompany = await prisma.company.update({
      where: { id: session.user.id },
      data: { logoUrl: null },
      include: {
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
      data: updatedCompany,
      message: 'Logo eliminado correctamente',
    });

  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}