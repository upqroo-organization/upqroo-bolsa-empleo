"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Clock,
  AlertTriangle,
  Eye,
  UserCheck,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react"

interface DashboardData {
  statistics: {
    totalStudents: { value: number; growth: number }
    approvedCompanies: { value: number; growth: number }
    totalVacantes: { value: number; growth: number }
    successfulPlacements: { value: number; growth: number }
  }
  pendingCompanies: Array<{
    id: string
    name: string
    sector: string
    size: string
    location: string
    submittedDate: string
    email: string
    phone?: string
    status: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    title: string
    description: string
    time: string
    status: string
    user: {
      name: string
      email: string
      image?: string
    }
  }>
  topStudents: Array<{
    id: string
    name: string
    position: string
    company: string
    hiredDate: string
    avatar?: string
  }>
}

export default function CoordinatorDashboard() {
  const { data: session, status } = useSession()
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
      if (session.user.role !== 'coordinator') {
        router.push("/")
        return
      }
      fetchDashboardData()
    }
  }, [status, router, session])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/coordinador/dashboard")
      
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

  // Helper function to format date
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

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'placement':
        return UserCheck
      case 'interview':
        return Calendar
      case 'validation':
        return Building2
      default:
        return Briefcase
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
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

  const stats = [
    {
      title: "Estudiantes Activos",
      value: dashboardData.statistics.totalStudents.value.toString(),
      change: `+${dashboardData.statistics.totalStudents.growth}%`,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Empresas Validadas",
      value: dashboardData.statistics.approvedCompanies.value.toString(),
      change: `+${dashboardData.statistics.approvedCompanies.growth}%`,
      trend: "up",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Vacantes Publicadas",
      value: dashboardData.statistics.totalVacantes.value.toString(),
      change: `+${dashboardData.statistics.totalVacantes.growth}%`,
      trend: "up",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Colocaciones Exitosas",
      value: dashboardData.statistics.successfulPlacements.value.toString(),
      change: `+${dashboardData.statistics.successfulPlacements.growth}%`,
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Coordinador</h1>
          <p className="text-muted-foreground">Supervisión y gestión de la bolsa de trabajo universitaria</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
          {/* <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Programar Reunión
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                {stat.change} desde el mes pasado
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimos eventos y acciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <div
                        className={`p-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-100 text-green-600"
                            : activity.status === "warning"
                              ? "bg-yellow-100 text-yellow-600"
                              : activity.status === "pending"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <ActivityIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.time)}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay actividad reciente</p>
                  <p className="text-sm">Las actividades aparecerán aquí cuando ocurran</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === "critical"
                      ? "border-red-500 bg-red-50"
                      : alert.type === "warning"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-blue-500 bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <Badge
                      variant={
                        alert.type === "critical" ? "destructive" : alert.type === "warning" ? "secondary" : "default"
                      }
                    >
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Empresas Pendientes
              </div>
              <Badge variant="secondary">{dashboardData.pendingCompanies.length}</Badge>
            </CardTitle>
            <CardDescription>Empresas esperando validación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.pendingCompanies.length > 0 ? (
                dashboardData.pendingCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{company.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {company.sector} • {company.size}
                      </p>
                      <p className="text-xs text-muted-foreground">{company.location}</p>
                      <p className="text-xs text-muted-foreground">
                        Enviado: {formatDate(company.submittedDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        Revisar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay empresas pendientes</p>
                  <p className="text-sm">Todas las empresas han sido validadas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
                Últimas Colocaciones
            </CardTitle>
            <CardDescription>Últimos estudiantes contratados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topStudents.length > 0 ? (
                dashboardData.topStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={student.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {student.position} en {student.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Contratado: {formatDate(student.hiredDate)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay colocaciones recientes</p>
                  <p className="text-sm">Las colocaciones exitosas aparecerán aquí</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
          <CardDescription>Funciones principales del coordinador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Building2 className="" />
              Validar Empresas
            </Button>
            {/* <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Seguimiento Estudiantes
            </Button> */}
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="" />
              Generar Reportes
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="" />
              Programar Eventos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
