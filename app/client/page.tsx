// Dashboard de aplicantes a vacantes
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Search,
  FileText,
  Calendar,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  User,
  Briefcase,
  GraduationCap,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const quickStats = [
    {
      icon: FileText,
      value: "12",
      label: "Postulaciones",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Calendar,
      value: "3",
      label: "Entrevistas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "Perfil Completo",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Clock,
      value: "240",
      label: "Horas Prácticas",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentApplications = [
    {
      title: "Desarrollador Frontend React",
      company: "TechCorp México",
      status: "En revisión",
      date: "Hace 2 días",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Analista de Sistemas",
      company: "DataSolutions",
      status: "Entrevista programada",
      date: "Hace 5 días",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      title: "Ingeniero de Software Jr",
      company: "Innovation Labs",
      status: "Rechazada",
      date: "Hace 1 semana",
      statusColor: "bg-red-100 text-red-800",
    },
  ]

  const recommendedJobs = [
    {
      title: "Desarrollador Full Stack",
      company: "StartupTech",
      location: "Cancún",
      salary: "$25,000 - $35,000",
      type: "Tiempo Completo",
    },
    {
      title: "Practicante de Desarrollo",
      company: "MegaCorp",
      location: "Playa del Carmen",
      salary: "$8,000 - $12,000",
      type: "Prácticas",
    },
  ]

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

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback className="text-lg">JP</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">¡Hola, Juan Pérez!</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Ingeniería en Software - 8vo Semestre
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Link href="/vacantes">
            <Button className="cursor-pointer">
              <Search className="mr-2 h-4 w-4" />
              Buscar Empleos
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <span className="text-sm font-bold">85%</span>
                </div>
                <Progress value={85} className="h-3" />
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
              <Button className="w-full">
                <Target className="mr-2 h-4 w-4" />
                Completar Perfil
              </Button>
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
                {recentApplications.map((application, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{application.title}</h4>
                      <p className="text-sm text-muted-foreground">{application.company}</p>
                      <p className="text-xs text-muted-foreground">{application.date}</p>
                    </div>
                    <Badge className={application.statusColor}>{application.status}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                Ver Todas las Postulaciones
              </Button>
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
                {recommendedJobs.map((job, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 hover:shadow-sm transition-shadow">
                    <h4 className="font-semibold text-sm">{job.title}</h4>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <DollarSign className="h-3 w-3" />
                      {job.salary}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                Ver Más Empleos
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
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Actualizar CV
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Buscar Prácticas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Calendario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
