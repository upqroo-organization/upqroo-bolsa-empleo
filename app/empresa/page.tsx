'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  Eye,
  MapPin,
  Star,
  Plus,
  FileText,
  Mail,
  Phone,
  Target,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function CompanyDashboard() {
  const { data: user } = useSession();
  const stats = [
    {
      icon: FileText,
      value: "8",
      label: "Vacantes Activas",
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+2 esta semana",
    },
    {
      icon: Users,
      value: "47",
      label: "Postulantes Totales",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "+12 nuevos",
    },
    {
      icon: Eye,
      value: "324",
      label: "Visualizaciones",
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+18% vs mes anterior",
    }
  ]

  const recentApplications = [
    {
      id: 1,
      name: "Ana García López",
      position: "Desarrollador Frontend React",
      avatar: "/placeholder.svg?height=40&width=40",
      appliedDate: "Hace 2 horas",
      status: "Nuevo",
      match: 95,
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      position: "Analista de Datos",
      avatar: "/placeholder.svg?height=40&width=40",
      appliedDate: "Hace 5 horas",
      status: "En revisión",
      match: 88,
    },
    {
      id: 3,
      name: "María Fernández",
      position: "Diseñador UX/UI",
      avatar: "/placeholder.svg?height=40&width=40",
      appliedDate: "Hace 1 día",
      status: "Entrevista",
      match: 92,
    },
  ]

  const activeJobs = [
    {
      id: 1,
      title: "Desarrollador Frontend React",
      applications: 15,
      views: 89,
      posted: "Hace 3 días",
      status: "Activa",
      priority: "Alta",
    },
    {
      id: 2,
      title: "Analista de Datos Jr",
      applications: 8,
      views: 45,
      posted: "Hace 1 semana",
      status: "Activa",
      priority: "Media",
    },
    {
      id: 3,
      title: "Diseñador UX/UI",
      applications: 12,
      views: 67,
      posted: "Hace 5 días",
      status: "Pausada",
      priority: "Baja",
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dashboard Empresa</h1>
            <p className="text-muted-foreground">{user?.user.name} - Bienvenido de vuelta</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/empresa/publicar-vacante">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Publicar Vacante
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
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
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Postulantes Recientes
                  </CardTitle>
                  <CardDescription>Nuevas aplicaciones a tus vacantes</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={application.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {application.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{application.name}</h4>
                        <p className="text-sm text-muted-foreground">{application.position}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            application.status === "Nuevo"
                              ? "default"
                              : application.status === "En revisión"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{application.appliedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Jobs Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Rendimiento de Vacantes
              </CardTitle>
              <CardDescription>Estado y métricas de tus vacantes activas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">Publicado {job.posted}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={job.status === "Activa" ? "default" : "secondary"}
                          className={job.status === "Activa" ? "bg-green-100 text-green-800" : ""}
                        >
                          {job.status}
                        </Badge>
                        <Badge variant="outline">{job.priority}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{job.applications} postulantes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{job.views} visualizaciones</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Postulantes
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Company Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perfil de Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">TechCorp México</h3>
                <p className="text-sm text-muted-foreground">Tecnología</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Cancún, Quintana Roo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contacto@techcorp.mx</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>(998) 123-4567</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Perfil completado</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Vacante
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Ver Postulantes
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Nueva postulación recibida",
                    detail: "Ana García - Desarrollador Frontend",
                    time: "Hace 2 horas",
                    icon: Users,
                    color: "text-green-600",
                  },
                  {
                    action: "Vacante visualizada",
                    detail: "Analista de Datos Jr",
                    time: "Hace 4 horas",
                    icon: Eye,
                    color: "text-blue-600",
                  },
                  {
                    action: "Perfil actualizado",
                    detail: "Información de contacto",
                    time: "Hace 1 día",
                    icon: Building2,
                    color: "text-purple-600",
                  },
                ].map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-muted p-2 rounded-lg">
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.detail}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
