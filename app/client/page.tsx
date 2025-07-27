"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bell,
  Search,
  FileText,
  Calendar,
  TrendingUp,
  MapPin,
  DollarSign,
  User,
  Briefcase,
  GraduationCap,
  Target,
} from "lucide-react"
import Link from "next/link"
import CVUploadModal from "@/components/CVUploadModal"

interface DashboardData {
  user: {
    name: string
    email: string
    image: string
    profileCompletion: number
  }
  statistics: {
    applications: number
    interviews: number
    profileCompletion: string
  }
  recentApplications: Array<{
    id: string
    title: string
    company: string
    companyLogo?: string
    status: string
    appliedAt: string
    location?: string
    state?: string
  }>
  recommendedJobs: Array<{
    id: string
    title: string
    company: string
    companyLogo?: string
    location?: string
    salaryMin?: number
    salaryMax?: number
    type?: string
    modality?: string
    state?: string
    applicationsCount: number
    createdAt: string
  }>
  applicationStats: {
    total: number
    pending: number
    interview: number
    hired: number
    rejected: number
  }
}

export default function StudentDashboard() {
  const { status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/client/dashboard")
      
      if (!response.ok) {
        throw new Error("Error al cargar los datos del dashboard")
      }

      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
      } else {
        setError(result.error || "Error desconocido")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'interview':
        return 'bg-blue-100 text-blue-800'
      case 'hired':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En revisión'
      case 'interview':
        return 'Entrevista programada'
      case 'hired':
        return 'Contratado'
      case 'rejected':
        return 'Rechazada'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Hace 1 día'
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 14) return 'Hace 1 semana'
    return `Hace ${Math.ceil(diffDays / 7)} semanas`
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salario a negociar'
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `Desde $${min.toLocaleString()}`
    if (max) return `Hasta $${max.toLocaleString()}`
    return 'Salario a negociar'
  }

  const upcomingEvents = [
    {
      title: "Feria de Empleo Virtual",
      date: "15 de Junio, 10:00 AM",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Taller: Preparación de CV",
      date: "20 de Junio, 2:00 PM",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const quickStats = [
    {
      icon: FileText,
      value: dashboardData.statistics.applications.toString(),
      label: "Postulaciones",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Calendar,
      value: dashboardData.statistics.interviews.toString(),
      label: "Entrevistas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: TrendingUp,
      value: dashboardData.statistics.profileCompletion,
      label: "Perfil Completo",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={dashboardData.user.image || "/placeholder.svg?height=64&width=64"} />
            <AvatarFallback className="text-lg">
              {dashboardData.user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">¡Hola, {dashboardData.user.name || 'Usuario'}!</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Estudiante UPQROO
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Link href="/vacantes">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Buscar Empleos
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Completa tu Perfil
              </CardTitle>
              <CardDescription>Un perfil completo aumenta tus posibilidades de ser contactado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progreso del perfil</span>
                  <span className="text-sm font-bold">{dashboardData.user.profileCompletion}%</span>
                </div>
                <Progress value={dashboardData.user.profileCompletion} className="h-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Información personal completa</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>CV subido</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Agregar portafolio (opcional)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Completar habilidades técnicas</span>
                  </div>
                </div>
              </div>
              <Link href="/client/perfil">
                <Button className="w-full">
                  <Target className="mr-2 h-4 w-4" />
                  Completar Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Mis Postulaciones Recientes
              </CardTitle>
              <CardDescription>Estado de tus últimas aplicaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentApplications.length > 0 ? (
                  dashboardData.recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{application.title}</h4>
                        <p className="text-sm text-muted-foreground">{application.company}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(application.appliedAt)}</p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusLabel(application.status)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No has aplicado a ninguna vacante aún</p>
                    <p className="text-sm">¡Comienza explorando las oportunidades disponibles!</p>
                  </div>
                )}
              </div>
              <Link href="client/mis-postulaciones">
                <Button variant="outline" className="w-full mt-6">
                  Ver Todas las Postulaciones
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recommended Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Empleos Recomendados</CardTitle>
              <CardDescription>Basado en tu perfil y carrera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recommendedJobs.length > 0 ? (
                  dashboardData.recommendedJobs.map((job) => (
                    <Link key={job.id} href={`/vacantes?job=${job.id}`}>
                      <div className="p-4 border rounded-lg space-y-3 hover:shadow-sm transition-shadow cursor-pointer">
                        <h4 className="font-semibold text-sm">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                        {job.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <DollarSign className="h-3 w-3" />
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </div>
                        {job.type && (
                          <Badge variant="secondary" className="text-xs">
                            {job.type}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay empleos disponibles</p>
                    <p className="text-sm">Revisa más tarde para nuevas oportunidades</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-6">
                <Link href="/vacantes">Ver Más Empleos</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => {
                  const Icon = event.icon
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`${event.bgColor} p-2 rounded-lg`}>
                        <Icon className={`h-4 w-4 ${event.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CVUploadModal />
              {/* <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Buscar Prácticas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Calendario
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}