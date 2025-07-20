import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Get active surveys within the date range
    const activeSurveys = await prisma.survey.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        responses: {
          where: { companyId },
          select: {
            id: true,
            studentId: true,
            isCompleted: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get students that the company has interacted with (through applications)
    const companyStudents = await prisma.application.findMany({
      where: {
        vacante: {
          companyId: companyId
        },
        status: { in: ['interview', 'hired'] } // Only students who had interviews or were hired
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      distinct: ['userId']
    });

    const students = companyStudents.map(app => app.user);

    // Calculate pending surveys for each survey
    const surveysWithPending = activeSurveys.map(survey => {
      const completedStudentIds = survey.responses
        .filter(r => r.isCompleted)
        .map(r => r.studentId);
      
      const pendingStudents = students.filter(
        student => !completedStudentIds.includes(student.id)
      );

      return {
        ...survey,
        pendingCount: pendingStudents.length,
        completedCount: survey.responses.filter(r => r.isCompleted).length,
        totalStudents: students.length,
        pendingStudents
      };
    });

    return NextResponse.json({
      surveys: surveysWithPending,
      students
    });
  } catch (error) {
    console.error('Error fetching company surveys:', error);
    return NextResponse.json(
      { error: 'Error fetching surveys' },
      { status: 500 }
    );
  }
}