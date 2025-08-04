import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado - Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const { filename } = await params;
    
    // Security check - only allow PDF files and prevent directory traversal
    if (!filename.endsWith('.pdf') || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Archivo no válido' },
        { status: 400 }
      );
    }

    // Extract user ID from filename (format: cv_userId_timestamp.pdf)
    const filenameParts = filename.replace('.pdf', '').split('_');
    if (filenameParts.length < 3 || filenameParts[0] !== 'cv') {
      return NextResponse.json(
        { error: 'Formato de archivo no válido' },
        { status: 400 }
      );
    }
    
    const fileOwnerId = filenameParts[1];

    // Check authorization based on user role
    let canAccess = false;

    if (session.user.id === fileOwnerId) {
      // User can access their own CV
      canAccess = true;
    } else if (session.user.role === 'coordinator') {
      // Coordinators can access any CV
      canAccess = true;
    } else if (session.user.role === 'company') {
      // Companies can access CVs of users who have applied to their job postings
      const hasApplication = await prisma.application.findFirst({
        where: {
          userId: fileOwnerId,
          vacante: {
            companyId: session.user.id
          }
        }
      });
      canAccess = !!hasApplication;
    }
    
    if (!canAccess) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a este archivo' },
        { status: 403 }
      );
    }

    // Verify the file belongs to a valid user
    const fileOwner = await prisma.user.findUnique({
      where: { id: fileOwnerId },
      select: { id: true, cvUrl: true }
    });

    if (!fileOwner || !fileOwner.cvUrl?.includes(filename)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado o no autorizado' },
        { status: 404 }
      );
    }

    const filePath = path.join(process.cwd(), 'uploads', 'cvs', filename);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error serving CV file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}