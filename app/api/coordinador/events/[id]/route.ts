import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateEventData } from '@/types/events';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const coordinator = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: 'Coordinador no encontrado' },
        { status: 404 }
      );
    }

    // Check if event exists and belongs to coordinator
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        coordinatorId: coordinator.id
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

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Error fetching coordinator event:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const coordinator = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: 'Coordinador no encontrado' },
        { status: 404 }
      );
    }

    // Check if event exists and belongs to coordinator
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: params.id,
        coordinatorId: coordinator.id
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    const body: UpdateEventData = await request.json();

    // Validate dates if provided
    if (body.startDate) {
      const startDate = new Date(body.startDate);
      if (startDate < new Date()) {
        return NextResponse.json(
          { success: false, message: 'La fecha de inicio debe ser futura' },
          { status: 400 }
        );
      }
    }

    if (body.endDate && body.startDate) {
      const startDate = new Date(body.startDate);
      const endDate = new Date(body.endDate);
      if (endDate <= startDate) {
        return NextResponse.json(
          { success: false, message: 'La fecha de fin debe ser posterior a la fecha de inicio' },
          { status: 400 }
        );
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.eventType && { eventType: body.eventType }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.isOnline !== undefined && { isOnline: body.isOnline }),
        ...(body.maxAttendees !== undefined && { maxAttendees: body.maxAttendees }),
        ...(body.registrationUrl !== undefined && { registrationUrl: body.registrationUrl }),
        ...(body.stateId !== undefined && { stateId: body.stateId }),
        ...(body.isActive !== undefined && { isActive: body.isActive })
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
      data: updatedEvent,
      message: 'Evento actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error updating coordinator event:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const coordinator = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!coordinator) {
      return NextResponse.json(
        { success: false, message: 'Coordinador no encontrado' },
        { status: 404 }
      );
    }

    // Check if event exists and belongs to coordinator
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: params.id,
        coordinatorId: coordinator.id
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    await prisma.event.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting coordinator event:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}