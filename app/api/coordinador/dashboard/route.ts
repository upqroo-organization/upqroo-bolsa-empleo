import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || session.user.role !== 'coordinator') {
            return NextResponse.json(
                {
                    error: 'No autorizado',
                    details: 'Solo coordinadores pueden acceder a este dashboard'
                },
                { status: 401 }
            )
        }

        // Get dashboard statistics
        const [
            totalStudents,
            approvedCompanies,
            totalVacantes,
            successfulPlacements,
            pendingCompanies,
            recentApplications,
            topStudents
        ] = await Promise.all([
            // Total active students (users with student role)
            prisma.user.count({
                where: {
                    role: {
                        name: 'student'
                    }
                }
            }),

            // Approved companies
            prisma.company.count({
                where: {
                    isApprove: true
                }
            }),

            // Total published vacantes
            prisma.vacante.count(),

            // Successful placements (hired applications)
            prisma.application.count({
                where: {
                    status: 'hired'
                }
            }),

            // Pending companies for validation
            prisma.company.findMany({
                where: {
                    isApprove: false
                },
                include: {
                    state: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            }),

            // Recent applications for activity feed
            prisma.application.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true
                        }
                    },
                    vacante: {
                        select: {
                            title: true,
                            company: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    appliedAt: 'desc'
                },
                take: 10
            }),

            // Top students (recently hired)
            prisma.application.findMany({
                where: {
                    status: 'hired'
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true
                        }
                    },
                    vacante: {
                        select: {
                            title: true,
                            company: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    hiredAt: 'desc'
                },
                take: 5
            })
        ])

        // Calculate monthly growth (simplified - you can enhance this)
        const currentMonth = new Date()
        const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)

        const [
            studentsThisMonth,
            companiesThisMonth,
            vacantesThisMonth,
            placementsThisMonth
        ] = await Promise.all([
            prisma.user.count({
                where: {
                    role: { name: 'student' },
                    createdAt: { gte: lastMonth }
                }
            }),
            prisma.company.count({
                where: {
                    isApprove: true,
                    createdAt: { gte: lastMonth }
                }
            }),
            prisma.vacante.count({
                where: {
                    createdAt: { gte: lastMonth }
                }
            }),
            prisma.application.count({
                where: {
                    status: 'hired',
                    hiredAt: { gte: lastMonth }
                }
            })
        ])

        // Calculate growth percentages (simplified)
        const calculateGrowth = (current: number, total: number) => {
            if (total === 0) return 0
            return Math.round((current / total) * 100)
        }

        // Format recent activity
        const recentActivity = recentApplications.map(app => {
            let activityType = 'application'
            let title = 'Nueva postulación'
            let description = `${app.user.name} se postuló para ${app.vacante.title}`
            let status = 'info'

            if (app.status === 'hired') {
                activityType = 'placement'
                title = 'Colocación exitosa'
                description = `${app.user.name} fue contratado en ${app.vacante.company.name}`
                status = 'success'
            } else if (app.status === 'interview') {
                activityType = 'interview'
                title = 'Entrevista programada'
                description = `${app.user.name} tiene entrevista para ${app.vacante.title}`
                status = 'pending'
            }

            return {
                id: app.id,
                type: activityType,
                title,
                description,
                time: app.appliedAt,
                status,
                user: app.user
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                statistics: {
                    totalStudents: {
                        value: totalStudents,
                        growth: calculateGrowth(studentsThisMonth, totalStudents)
                    },
                    approvedCompanies: {
                        value: approvedCompanies,
                        growth: calculateGrowth(companiesThisMonth, approvedCompanies)
                    },
                    totalVacantes: {
                        value: totalVacantes,
                        growth: calculateGrowth(vacantesThisMonth, totalVacantes)
                    },
                    successfulPlacements: {
                        value: successfulPlacements,
                        growth: calculateGrowth(placementsThisMonth, successfulPlacements)
                    }
                },
                pendingCompanies: pendingCompanies.map(company => ({
                    id: company.id,
                    name: company.name,
                    sector: company.industry || 'No especificado',
                    size: company.size || 'No especificado',
                    location: company.state?.name || company.city || 'No especificado',
                    submittedDate: company.createdAt,
                    email: company.email,
                    phone: company.phone,
                    status: 'pending'
                })),
                recentActivity,
                topStudents: topStudents.map(placement => ({
                    id: placement.user.email,
                    name: placement.user.name,
                    position: placement.vacante.title,
                    company: placement.vacante.company.name,
                    hiredDate: placement.hiredAt,
                    avatar: placement.user.image
                }))
            }
        })

    } catch (error) {
        console.error('Error fetching coordinator dashboard data:', error)
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: 'No se pudo cargar la información del dashboard'
            },
            { status: 500 }
        )
    }
}