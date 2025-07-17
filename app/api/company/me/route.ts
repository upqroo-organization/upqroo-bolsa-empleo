import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'company') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Fetch company data
    const company = await prisma.company.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
    });

  } catch (error) {
    console.error('Error fetching company data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}