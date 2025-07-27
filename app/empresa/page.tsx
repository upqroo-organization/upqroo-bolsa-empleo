'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  MapPin,
  Plus,
  FileText,
  Mail,
  Phone,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useCompanyDashboard } from "@/hooks/useCompanyDashboard"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function CompanyDashboard() {
  const { data, loading, error, refetch } = useCompanyDashboard();
  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Error al cargar el dashboard</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      icon: FileText,
      value: data.stats.activeVacancies.count.toString(),
      label: "Vacantes Activas",
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: `+${data.stats.activeVacancies.change} esta semana`,
    },
    {
      icon: Users,
      value: data.stats.totalApplications.count.toString(),
      label: "Postulantes Totales",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: `+${data.stats.totalApplications.change} nuevos`,
    },
    // {
    //   icon: Eye,
    //   value: data.stats.totalViews.count.toString(),
    //   label: "Visualizaciones",
    //   color: "text-accent",
    //   bgColor: "bg-accent/10",
    //   change: `+${data.stats.totalViews.growth}% vs mes anterior`,
    // }
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'interview':
        return 'secondary';
      case 'hired':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Nuevo';
      case 'interview':
        return 'Entrevista';
      case 'hired':
        return 'Contratado';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{data.company.name}</h1>
            <p className="text-muted-foreground">Inicio</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button 
            variant="outline" 
            onClick={refetch}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Actualizar"
            )}
          </Button> */}
          <Link href="/empresa/publicar-vacante">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Publicar Vacante
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                <Link href="/empresa/gestionar-vacante">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentApplications.length > 0 ? (
                  data.recentApplications.slice(0, 5).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={application.user.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {application.user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{application.user.name || "Usuario"}</h4>
                          <p className="text-sm text-muted-foreground">{application.vacante.title}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {getStatusLabel(application.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(application.appliedAt), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay postulaciones recientes</p>
                  </div>
                )}
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
                {data.activeJobs.length > 0 ? (
                  data.activeJobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Publicado {formatDistanceToNow(new Date(job.createdAt), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={job.status === "active" ? "default" : "secondary"}
                            className={job.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {job.status === "active" ? "Activa" : "Expirada"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{job.applicationsCount} postulantes</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/empresa/gestionar-vacante?id=${job.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Postulantes
                          </Button>
                        </Link>
                        <Link href={`/empresa/editar-vacante/${job.id}`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tienes vacantes activas</p>
                    <Link href="/empresa/publicar-vacante">
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Publicar Primera Vacante
                      </Button>
                    </Link>
                  </div>
                )}
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
                  {data.company.logoUrl ? (
                    <img 
                      src={data.company.logoUrl} 
                      alt={data.company.name}
                      className="w-12 h-12 object-contain rounded"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold">{data.company.name}</h3>
                <p className="text-sm text-muted-foreground">{data.company.industry || "Empresa"}</p>
              </div>
              <div className="space-y-2 text-sm">
                {data.company.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{data.company.city}{data.company.state ? `, ${data.company.state.name}` : ""}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{data.company.contactEmail || data.company.email}</span>
                </div>
                {data.company.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{data.company.contactPhone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Perfil completado</span>
                  <span className="font-medium">{data.company.profileCompletion}%</span>
                </div>
                <Progress value={data.company.profileCompletion} className="h-2" />
              </div>
              <Link href="/empresa/perfil">
                <Button variant="outline" className="w-full">
                  Editar Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 grid">
              <Link href="/empresa/publicar-vacante">
                <Button className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Vacante
                </Button>
              </Link>
              <Link href="/empresa/gestionar-vacante">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Ver Postulantes
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentApplications.length > 0 ? (
                  data.recentApplications.slice(0, 3).map((application) => {
                    return (
                      <div key={application.id} className="flex items-start gap-3">
                        <div className="bg-muted p-2 rounded-lg">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Nueva postulación recibida</p>
                          <p className="text-xs text-muted-foreground">
                            {application.user.name} - {application.vacante.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(application.appliedAt), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No hay actividad reciente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
