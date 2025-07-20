import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateSurveyData } from '@/types/survey';
import { SURVEY_LIMITS } from '@/constants/survey';

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

    // Validate input data
    if (!data.title || data.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      );
    }

    if (data.title.length > SURVEY_LIMITS.TITLE_MAX_LENGTH) {
      return NextResponse.json(
        { error: `El título no puede exceder ${SURVEY_LIMITS.TITLE_MAX_LENGTH} caracteres` },
        { status: 400 }
      );
    }

    if (data.description && data.description.length > SURVEY_LIMITS.DESCRIPTION_MAX_LENGTH) {
      return NextResponse.json(
        { error: `La descripción no puede exceder ${SURVEY_LIMITS.DESCRIPTION_MAX_LENGTH} caracteres` },
        { status: 400 }
      );
    }

    if (data.daysAfterHiring < SURVEY_LIMITS.MIN_DAYS_AFTER_HIRING || data.daysAfterHiring > SURVEY_LIMITS.MAX_DAYS_AFTER_HIRING) {
      return NextResponse.json(
        { error: `Los días después de contratación deben estar entre ${SURVEY_LIMITS.MIN_DAYS_AFTER_HIRING} y ${SURVEY_LIMITS.MAX_DAYS_AFTER_HIRING}` },
        { status: 400 }
      );
    }

    if (data.surveyDuration < SURVEY_LIMITS.MIN_SURVEY_DURATION || data.surveyDuration > SURVEY_LIMITS.MAX_SURVEY_DURATION) {
      return NextResponse.json(
        { error: `La duración de la encuesta debe estar entre ${SURVEY_LIMITS.MIN_SURVEY_DURATION} y ${SURVEY_LIMITS.MAX_SURVEY_DURATION} días` },
        { status: 400 }
      );
    }

    if (!data.questions || data.questions.length < SURVEY_LIMITS.MIN_QUESTIONS) {
      return NextResponse.json(
        { error: `Debe tener al menos ${SURVEY_LIMITS.MIN_QUESTIONS} pregunta` },
        { status: 400 }
      );
    }

    if (data.questions.length > SURVEY_LIMITS.MAX_QUESTIONS) {
      return NextResponse.json(
        { error: `No puede tener más de ${SURVEY_LIMITS.MAX_QUESTIONS} preguntas` },
        { status: 400 }
      );
    }

    // Validate each question
    for (const question of data.questions) {
      if (!question.question || question.question.trim().length === 0) {
        return NextResponse.json(
          { error: 'Todas las preguntas son requeridas' },
          { status: 400 }
        );
      }

      if (question.question.length > SURVEY_LIMITS.QUESTION_MAX_LENGTH) {
        return NextResponse.json(
          { error: `Las preguntas no pueden exceder ${SURVEY_LIMITS.QUESTION_MAX_LENGTH} caracteres` },
          { status: 400 }
        );
      }
    }

    const survey = await prisma.survey.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        daysAfterHiring: data.daysAfterHiring,
        surveyDuration: data.surveyDuration,
        questions: {
          create: data.questions.map((q, index) => ({
            question: q.question.trim(),
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
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}