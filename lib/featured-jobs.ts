import { prisma } from '@/lib/prisma'

export interface FeaturedJob {
  id: string
  title: string
  summary: string
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  type: string | null
  modality: string | null
  career: string | null
  createdAt: Date
  company: {
    name: string
    logoUrl: string | null
  }
  state: {
    name: string
  } | null
}

export async function getFeaturedJobs(limit: number = 6): Promise<FeaturedJob[]> {
  try {
    const jobs = await prisma.vacante.findMany({
      where: {
        isMock: false, // Only real jobs, not mock data
      },
      select: {
        id: true,
        title: true,
        summary: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        type: true,
        modality: true,
        career: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logoUrl: true,
          }
        },
        state: {
          select: {
            name: true,
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }, // Most recent first
      ],
      take: limit,
    })

    return jobs
  } catch (error) {
    console.error('Error fetching featured jobs:', error)
    return []
  }
}

export async function getJobsStats() {
  try {
    const [totalJobs, totalCompanies, totalUsers, successfulPlacements, totalApplications] = await Promise.all([
      prisma.vacante.count({
        where: { isMock: false }
      }),
      prisma.company.count({
        where: { isApprove: true }
      }),
      prisma.user.count({
        where: {
          role: {
            name: 'student'
          }
        }
      }),
      // Count successful placements (hired applications)
      prisma.application.count({
        where: {
          status: 'hired'
        }
      }),
      // Count total applications to calculate placement rate
      prisma.application.count()
    ])

    // Calculate real placement rate based on hired applications vs total applications
    // If no applications exist, show 0% instead of a mock rate
    const placementRate = totalApplications > 0
      ? Math.round((successfulPlacements / totalApplications) * 100)
      : 0

    return {
      totalJobs,
      totalCompanies,
      totalUsers,
      placementRate,
      successfulPlacements // Add this for potential future use
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalJobs: 0,
      totalCompanies: 0,
      totalUsers: 0,
      placementRate: 0,
      successfulPlacements: 0
    }
  }
}