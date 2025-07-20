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

    // Get all active surveys
    const activeSurveys = await prisma.survey.findMany({
      where: {
        isActive: true
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

    // Get students that the company has hired with their hiring dates
    const hiredStudents = await prisma.application.findMany({
      where: {
        vacante: {
          companyId: companyId
        },
        status: 'hired',
        hiredAt: { not: null }
      },
      select: {
        userId: true,
        hiredAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Calculate available surveys for each survey based on hiring dates
    const surveysWithAvailability = activeSurveys.map(survey => {
      const completedStudentIds = survey.responses
        .filter(r => r.isCompleted)
        .map(r => r.studentId);
      
      // Filter students based on survey timing
      const availableStudents = hiredStudents.filter(application => {
        if (!application.hiredAt) return false;
        
        const hiredDate = new Date(application.hiredAt);
        const surveyStartDate = new Date(hiredDate.getTime() + (survey.daysAfterHiring * 24 * 60 * 60 * 1000));
        const surveyEndDate = new Date(surveyStartDate.getTime() + (survey.surveyDuration * 24 * 60 * 60 * 1000));
        
        // Survey is available if current date is within the survey window
        return now >= surveyStartDate && now <= surveyEndDate;
      });

      const pendingStudents = availableStudents
        .filter(app => !completedStudentIds.includes(app.userId))
        .map(app => app.user);

      const totalAvailableStudents = availableStudents.map(app => app.user);

      return {
        ...survey,
        pendingCount: pendingStudents.length,
        completedCount: survey.responses.filter(r => r.isCompleted).length,
        totalStudents: totalAvailableStudents.length,
        pendingStudents,
        availableStudents: totalAvailableStudents
      };
    });

    // Only return surveys that have available students
    const availableSurveys = surveysWithAvailability.filter(survey => survey.totalStudents > 0);

    return NextResponse.json({
      surveys: availableSurveys,
      students: hiredStudents.map(app => app.user)
    });
  } catch (error) {
    console.error('Error fetching company surveys:', error);
    return NextResponse.json(
      { error: 'Error fetching surveys' },
      { status: 500 }
    );
  }
}