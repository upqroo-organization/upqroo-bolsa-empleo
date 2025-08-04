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
    
    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Nombre de archivo inválido' },
        { status: 400 }
      );
    }

    // Extract user ID from filename (format: photo_userId_timestamp.ext)
    const filenameParts = filename.split('_');
    if (filenameParts.length < 3 || filenameParts[0] !== 'photo') {
      return NextResponse.json(
        { error: 'Formato de archivo no válido' },
        { status: 400 }
      );
    }
    
    const fileOwnerId = filenameParts[1];

    // Check authorization: user can access their own photo or coordinators can access any photo
    const canAccess = session.user.id === fileOwnerId || session.user.role === 'coordinator';
    
    if (!canAccess) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a este archivo' },
        { status: 403 }
      );
    }

    // Verify the file belongs to a valid user
    const fileOwner = await prisma.user.findUnique({
      where: { id: fileOwnerId },
      select: { id: true, image: true }
    });

    if (!fileOwner || !fileOwner.image?.includes(filename)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado o no autorizado' },
        { status: 404 }
      );
    }

    const filePath = path.join(process.cwd(), 'uploads', 'photos', filename);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const extension = filename.split('.').pop()?.toLowerCase();
    let contentType = 'image/jpeg'; // default
    
    switch (extension) {
      case 'png':
        contentType = 'image/png';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
    }

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour but mark as private
      },
    });

  } catch (error) {
    console.error('Error serving photo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}