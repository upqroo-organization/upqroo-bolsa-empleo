"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export default function CoordinatorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = [
    {
      title: "Estudiantes Activos",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Empresas Validadas",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Vacantes Publicadas",
      value: "156",
      change: "+18%",
      trend: "up",
      icon: Briefcase,
      color: "text-purple-600",
    },
    {
      title: "Colocaciones Exitosas",
      value: "73",
      change: "+23%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "validation",
      title: "Nueva empresa registrada",
      description: "TechCorp S.A. solicita validación",
      time: "Hace 2 horas",
      status: "pending",
      icon: Building2,
    },
    {
      id: 2,
      type: "placement",
      title: "Colocación exitosa",
      description: "María González fue contratada en DevSoft",
      time: "Hace 4 horas",
      status: "success",
      icon: UserCheck,
    },
    {
      id: 3,
      type: "alert",
      title: "Estudiante inactivo",
      description: "Carlos Pérez sin actividad por 30 días",
      time: "Hace 6 horas",
      status: "warning",
      icon: AlertTriangle,
    },
    {
      id: 4,
      type: "job",
      title: "Nueva vacante publicada",
      description: "Desarrollador Frontend en InnovateLab",
      time: "Hace 8 horas",
      status: "info",
      icon: Briefcase,
    },
  ]

  const pendingCompanies = [
    {
      id: 1,
      name: "TechCorp S.A.",
      sector: "Tecnología",
      size: "50-100 empleados",
      location: "Chetumal",
      submittedDate: "2024-01-15",
      documents: 4,
      status: "pending",
    },
    {
      id: 2,
      name: "Green Solutions",
      sector: "Sustentabilidad",
      size: "10-50 empleados",
      location: "Cancún",
      submittedDate: "2024-01-14",
      documents: 3,
      status: "review",
    },
    {
      id: 3,
      name: "Maya Tourism",
      sector: "Turismo",
      size: "100+ empleados",
      location: "Playa del Carmen",
      submittedDate: "2024-01-13",
      documents: 5,
      status: "pending",
    },
  ]

  const topStudents = [
    {
      id: 1,
      name: "Ana Rodríguez",
      career: "Ing. en Sistemas",
      semester: "8vo",
      gpa: 9.2,
      applications: 12,
      interviews: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Luis Martínez",
      career: "Ing. Industrial",
      semester: "7mo",
      gpa: 8.9,
      applications: 8,
      interviews: 3,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Sofia Chen",
      career: "Ing. Ambiental",
      semester: "6to",
      gpa: 9.5,
      applications: 15,
      interviews: 7,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "critical",
      title: "Servidor de respaldo",
      message: "Requiere mantenimiento programado",
      time: "Hace 1 hora",
    },
    {
      id: 2,
      type: "warning",
      title: "Capacidad de almacenamiento",
      message: "85% utilizado, considerar expansión",
      time: "Hace 3 horas",
    },
    {
      id: 3,
      type: "info",
      title: "Actualización disponible",
      message: "Nueva versión del sistema disponible",
      time: "Hace 1 día",
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
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Programar Reunión
          </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              {recentActivity.map((activity) => (
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
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
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
        </Card>
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
              <Badge variant="secondary">{pendingCompanies.length}</Badge>
            </CardTitle>
            <CardDescription>Empresas esperando validación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{company.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {company.sector} • {company.size}
                    </p>
                    <p className="text-xs text-muted-foreground">{company.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{company.documents} docs</Badge>
                    <Button size="sm" variant="outline">
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Estudiantes Destacados
            </CardTitle>
            <CardDescription>Estudiantes con mejor rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student) => (
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
                      {student.career} • {student.semester}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs">Promedio: {student.gpa}</span>
                      <span className="text-xs">{student.applications} postulaciones</span>
                      <span className="text-xs">{student.interviews} entrevistas</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Building2 className="h-6 w-6 mb-2" />
              Validar Empresas
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Seguimiento Estudiantes
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Generar Reportes
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Programar Eventos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
