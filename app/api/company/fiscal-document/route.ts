import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'fiscal-documents');

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
    const file = formData.get('fiscalDocument') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validate file type (PDF and common image formats)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos PDF, JPG, PNG o WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max for documents)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB' },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await ensureUploadsDir();

    // Get current company to check if they have an existing fiscal document
    const currentCompany = await prisma.company.findUnique({
      where: { id: session.user.id },
      select: { fiscalDocumentUrl: true }
    });

    // Delete existing fiscal document file if it exists
    if (currentCompany?.fiscalDocumentUrl) {
      const existingFilePath = path.join(process.cwd(), currentCompany.fiscalDocumentUrl);
      try {
        if (existsSync(existingFilePath)) {
          await unlink(existingFilePath);
        }
      } catch (error) {
        console.warn('Could not delete existing fiscal document file:', error);
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'pdf';
    const fileName = `fiscal_${session.user.id}_${timestamp}.${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const relativePath = `uploads/fiscal-documents/${fileName}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update company record with fiscal document URL
    const updatedCompany = await prisma.company.update({
      where: { id: session.user.id },
      data: { fiscalDocumentUrl: relativePath },
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
      message: 'Constancia de situación fiscal subida correctamente',
    });

  } catch (error) {
    console.error('Error uploading fiscal document:', error);
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

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get current company fiscal document info
    const currentCompany = await prisma.company.findUnique({
      where: { id: session.user.id },
      select: { fiscalDocumentUrl: true }
    });

    if (!currentCompany?.fiscalDocumentUrl) {
      return NextResponse.json(
        { error: 'No tienes una constancia fiscal para eliminar' },
        { status: 404 }
      );
    }

    // Delete the file
    const filePath = path.join(process.cwd(), currentCompany.fiscalDocumentUrl);
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.warn('Could not delete fiscal document file:', error);
    }

    // Update company record to remove fiscal document URL
    const updatedCompany = await prisma.company.update({
      where: { id: session.user.id },
      data: { fiscalDocumentUrl: null },
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
      message: 'Constancia fiscal eliminada correctamente',
    });

  } catch (error) {
    console.error('Error deleting fiscal document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}