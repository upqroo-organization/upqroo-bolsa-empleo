import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateEventData } from '@/types/events';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get coordinator user
    const coordinator = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: 'Coordinador no encontrado' },
        { status: 404 }
      );
    }

    const events = await prisma.event.findMany({
      where: { coordinatorId: coordinator.id },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        state: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error('Error fetching coordinator events:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get coordinator user
    const coordinator = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: 'Coordinador no encontrado' },
        { status: 404 }
      );
    }

    const body: CreateEventData = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.eventType || !body.startDate) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = body.endDate ? new Date(body.endDate) : null;

    if (startDate < new Date()) {
      return NextResponse.json(
        { success: false, message: 'La fecha de inicio debe ser futura' },
        { status: 400 }
      );
    }

    if (endDate && endDate <= startDate) {
      return NextResponse.json(
        { success: false, message: 'La fecha de fin debe ser posterior a la fecha de inicio' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        eventType: body.eventType,
        startDate,
        endDate,
        location: body.location,
        isOnline: body.isOnline,
        maxAttendees: body.maxAttendees,
        registrationUrl: body.registrationUrl,
        coordinatorId: coordinator.id,
        stateId: body.stateId
      },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        state: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Evento creado exitosamente'
    });

  } catch (error) {
    console.error('Error creating coordinator event:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}