import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateSurveyData } from '@/types/survey';

export async function GET() {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            responses: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { error: 'Error fetching surveys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateSurveyData = await request.json();

    const survey = await prisma.survey.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        questions: {
          create: data.questions.map((q, index) => ({
            question: q.question,
            order: q.order || index + 1,
            isRequired: q.isRequired ?? true
          }))
        }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    console.error('Error creating survey:', error);
    return NextResponse.json(
      { error: 'Error creating survey' },
      { status: 500 }
    );
  }
}