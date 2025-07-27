import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, studentId, answers, comments }: {
      companyId: string;
      studentId: string;
      answers: Record<string, number>;
      comments?: string;
    } = await request.json();

    // Check if response already exists
    const existingResponse = await prisma.surveyResponse.findUnique({
      where: {
        surveyId_companyId_studentId: {
          surveyId: id,
          companyId,
          studentId
        }
      }
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: 'Survey response already exists' },
        { status: 400 }
      );
    }

    // Create response with answers
    const response = await prisma.surveyResponse.create({
      data: {
        surveyId: id,
        companyId,
        studentId,
        isCompleted: true,
        comments,
        answers: {
          create: Object.entries(answers).map(([questionId, rating]) => ({
            questionId,
            rating
          }))
        }
      },
      include: {
        answers: {
          include: {
            question: true
          }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating survey response:', error);
    return NextResponse.json(
      { error: 'Error creating survey response' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const responses = await prisma.surveyResponse.findMany({
      where: {
        surveyId: id,
        companyId
      },
      include: {
        answers: {
          include: {
            question: true
          }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json(
      { error: 'Error fetching responses' },
      { status: 500 }
    );
  }
}