import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateEventData } from '@/types/events';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'company') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company ID
    const company = await prisma.company.findUnique({
      where: { email: session.user.email! }
    });

    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const event = await prisma.event.findFirst({
      where: {
        id,
        companyId: company.id
      },
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
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'company') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company ID
    const company = await prisma.company.findUnique({
      where: { email: session.user.email! }
    });

    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    // Check if event exists and belongs to company
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        companyId: company.id
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    const body: UpdateEventData = await request.json();

    // Validate dates if both are provided
    if (body.startDate && body.endDate) {
      const startDate = new Date(body.startDate);
      const endDate = new Date(body.endDate);
      if (endDate <= startDate) {
        return NextResponse.json(
          { success: false, message: 'La fecha de fin debe ser posterior a la fecha de inicio' },
          { status: 400 }
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.eventType !== undefined) updateData.eventType = body.eventType;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.isOnline !== undefined) updateData.isOnline = body.isOnline;
    if (body.maxAttendees !== undefined) updateData.maxAttendees = body.maxAttendees;
    if (body.registrationUrl !== undefined) updateData.registrationUrl = body.registrationUrl;
    if (body.stateId !== undefined) updateData.stateId = body.stateId;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
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
      }
    });

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Evento actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'company') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get company ID
    const company = await prisma.company.findUnique({
      where: { email: session.user.email! }
    });

    if (!company) {
      return NextResponse.json(
        { success: false, message: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    // Check if event exists and belongs to company
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        companyId: company.id
      }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}