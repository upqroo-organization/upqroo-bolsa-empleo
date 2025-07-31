import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const eventType = searchParams.get('eventType');
    const stateId = searchParams.get('stateId');
    const upcoming = searchParams.get('upcoming') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
      company: {
        isApprove: true // Only show events from approved companies
      }
    };

    if (eventType) {
      where.eventType = eventType;
    }

    if (stateId) {
      where.stateId = parseInt(stateId);
    }

    if (upcoming) {
      where.startDate = {
        gte: new Date()
      };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true
            }
          },
          state: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit
      }),
      prisma.event.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching public events:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}