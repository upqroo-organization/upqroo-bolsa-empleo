import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        responses: {
          include: {
            company: {
              select: { id: true, name: true }
            },
            student: {
              select: { id: true, name: true, email: true }
            },
            answers: {
              include: {
                question: true
              }
            }
          }
        }
      }
    });

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json(
      { error: 'Error fetching survey' },
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
    const data = await request.json();

    const survey = await prisma.survey.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        daysAfterHiring: data.daysAfterHiring,
        surveyDuration: data.surveyDuration,
        isActive: data.isActive
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(survey);
  } catch (error) {
    console.error('Error updating survey:', error);
    return NextResponse.json(
      { error: 'Error updating survey' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.survey.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting survey:', error);
    return NextResponse.json(
      { error: 'Error deleting survey' },
      { status: 500 }
    );
  }
}