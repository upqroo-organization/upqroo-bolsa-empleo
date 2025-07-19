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
      include: {
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
    const [totalJobs, totalCompanies, totalUsers] = await Promise.all([
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
      })
    ])

    // Calculate placement rate (this is a mock calculation - you might want to implement real logic)
    const placementRate = Math.min(85, Math.round((totalJobs / Math.max(totalUsers, 1)) * 100))

    return {
      totalJobs,
      totalCompanies,
      totalUsers,
      placementRate
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalJobs: 0,
      totalCompanies: 0,
      totalUsers: 0,
      placementRate: 0
    }
  }
}