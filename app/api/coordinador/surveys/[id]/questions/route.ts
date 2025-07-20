import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const question = await prisma.surveyQuestion.create({
      data: {
        surveyId: params.id,
        question: data.question,
        order: data.order,
        isRequired: data.isRequired ?? true
      }
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Error creating question' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { questions } = await request.json();

    // Update questions in a transaction
    await prisma.$transaction(
      questions.map((q: any) =>
        prisma.surveyQuestion.update({
          where: { id: q.id },
          data: {
            question: q.question,
            order: q.order,
            isRequired: q.isRequired
          }
        })
      )
    );

    const updatedQuestions = await prisma.surveyQuestion.findMany({
      where: { surveyId: params.id },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(updatedQuestions);
  } catch (error) {
    console.error('Error updating questions:', error);
    return NextResponse.json(
      { error: 'Error updating questions' },
      { status: 500 }
    );
  }
}