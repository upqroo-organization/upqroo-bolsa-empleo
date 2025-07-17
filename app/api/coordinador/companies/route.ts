import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const sector = searchParams.get('sector') || 'all';

    // Build filter conditions
    const whereConditions: any = {};

    // Filter by approval status
    if (status === 'pending') {
      whereConditions.isApprove = false;
    } else if (status === 'approved') {
      whereConditions.isApprove = true;
    }

    // Filter by search term
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by sector
    if (sector !== 'all') {
      whereConditions.industry = sector;
    }

    // Fetch companies with filters
    const companies = await prisma.company.findMany({
      where: whereConditions,
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
        vacantes: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get statistics
    const statistics = {
      pending: await prisma.company.count({ where: { isApprove: false } }),
      approved: await prisma.company.count({ where: { isApprove: true } }),
      total: await prisma.company.count(),
    };

    return NextResponse.json({
      success: true,
      data: {
        companies,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}