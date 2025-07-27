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
      select: {
        id: true,
        title: true,
        daysAfterHiring: true,
        surveyDuration: true,
        responses: {
          where: { 
            companyId,
            isCompleted: true 
          },
          select: {
            studentId: true
          }
        }
      }
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
        hiredAt: true
      }
    });

    // Calculate pending surveys count
    let totalPendingSurveys = 0;
    const surveysWithPending = [];

    for (const survey of activeSurveys) {
      const completedStudentIds = survey.responses.map(r => r.studentId);
      
      // Filter students based on survey timing
      const availableStudents = hiredStudents.filter(application => {
        if (!application.hiredAt) return false;
        
        const hiredDate = new Date(application.hiredAt);
        const surveyStartDate = new Date(hiredDate.getTime() + (survey.daysAfterHiring * 24 * 60 * 60 * 1000));
        const surveyEndDate = new Date(surveyStartDate.getTime() + (survey.surveyDuration * 24 * 60 * 60 * 1000));
        
        // Survey is available if current date is within the survey window
        return now >= surveyStartDate && now <= surveyEndDate;
      });

      const pendingCount = availableStudents.filter(app => !completedStudentIds.includes(app.userId)).length;
      
      if (pendingCount > 0) {
        totalPendingSurveys += pendingCount;
        surveysWithPending.push({
          id: survey.id,
          title: survey.title,
          pendingCount
        });
      }
    }

    return NextResponse.json({
      totalPendingSurveys,
      surveysWithPending
    });
  } catch (error) {
    console.error('Error fetching survey notifications:', error);
    return NextResponse.json(
      { error: 'Error fetching notifications' },
      { status: 500 }
    );
  }
}