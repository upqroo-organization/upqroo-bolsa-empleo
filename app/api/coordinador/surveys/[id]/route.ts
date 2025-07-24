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

    // Use transaction to update survey and questions atomically
    const result = await prisma.$transaction(async (tx) => {
      // Update survey basic info
      const updatedSurvey = await tx.survey.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          daysAfterHiring: data.daysAfterHiring,
          surveyDuration: data.surveyDuration,
          isActive: data.isActive !== undefined ? data.isActive : undefined
        }
      });

      // If questions are provided, update them intelligently to preserve responses
      if (data.questions && Array.isArray(data.questions)) {
        // Get existing questions
        const existingQuestions = await tx.surveyQuestion.findMany({
          where: { surveyId: id },
          orderBy: { order: 'asc' }
        });

        // Create a map of existing questions by their text content for matching
        const existingQuestionsMap = new Map(
          existingQuestions.map(q => [q.question.trim().toLowerCase(), q])
        );

        // Process new questions
        const questionsToKeep = new Set<string>();
        const questionsToCreate: any[] = [];
        const questionsToUpdate: any[] = [];

        data.questions.forEach((newQuestion: any, index: number) => {
          const questionText = newQuestion.question.trim().toLowerCase();
          const existingQuestion = existingQuestionsMap.get(questionText);

          if (existingQuestion) {
            // Question exists, update it if needed
            questionsToKeep.add(existingQuestion.id);
            if (existingQuestion.order !== index + 1 || existingQuestion.isRequired !== (newQuestion.isRequired !== undefined ? newQuestion.isRequired : true)) {
              questionsToUpdate.push({
                id: existingQuestion.id,
                order: index + 1,
                isRequired: newQuestion.isRequired !== undefined ? newQuestion.isRequired : true
              });
            }
          } else {
            // New question, create it
            questionsToCreate.push({
              surveyId: id,
              question: newQuestion.question,
              order: index + 1,
              isRequired: newQuestion.isRequired !== undefined ? newQuestion.isRequired : true
            });
          }
        });

        // Delete questions that are no longer needed (this will cascade delete their answers)
        const questionsToDelete = existingQuestions
          .filter(q => !questionsToKeep.has(q.id))
          .map(q => q.id);

        if (questionsToDelete.length > 0) {
          await tx.surveyQuestion.deleteMany({
            where: {
              id: { in: questionsToDelete }
            }
          });
        }

        // Update existing questions
        for (const questionUpdate of questionsToUpdate) {
          await tx.surveyQuestion.update({
            where: { id: questionUpdate.id },
            data: {
              order: questionUpdate.order,
              isRequired: questionUpdate.isRequired
            }
          });
        }

        // Create new questions
        if (questionsToCreate.length > 0) {
          await tx.surveyQuestion.createMany({
            data: questionsToCreate
          });
        }
      }

      // Return updated survey with questions
      return await tx.survey.findUnique({
        where: { id },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      });
    });

    return NextResponse.json(result);
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