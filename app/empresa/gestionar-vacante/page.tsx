import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Pause,
  Play,
  Trash2,
  Copy,
  MoreHorizontal,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"

export default function ManageJobs() {
  const jobs = [
    {
      id: 1,
      title: "Desarrollador Frontend React",
      department: "Tecnología",
      type: "Tiempo Completo",
      location: "Cancún, Q.Roo",
      salary: "$25,000 - $35,000",
      status: "Activa",
      applications: 15,
      views: 89,
      posted: "2024-06-10",
      expires: "2024-07-10",
      priority: "Alta",
      featured: true,
    },
    {
      id: 2,
      title: "Analista de Datos Jr",
      department: "Tecnología",
      type: "Prácticas",
      location: "Playa del Carmen",
      salary: "$8,000 - $12,000",
      status: "Activa",
      applications: 8,
      views: 45,
      posted: "2024-06-08",
      expires: "2024-07-08",
      priority: "Media",
      featured: false,
    },
    {
      id: 3,
      title: "Diseñador UX/UI",
      department: "Diseño",
      type: "Medio Tiempo",
      location: "Cozumel, Q.Roo",
      salary: "$15,000 - $20,000",
      status: "Pausada",
      applications: 12,
      views: 67,
      posted: "2024-06-05",
      expires: "2024-07-05",
      priority: "Baja",
      featured: false,
    },
    {
      id: 4,
      title: "Administrador de Sistemas",
      department: "Tecnología",
      type: "Tiempo Completo",
      location: "Cancún, Q.Roo",
      salary: "$20,000 - $28,000",
      status: "Expirada",
      applications: 5,
      views: 23,
      posted: "2024-05-15",
      expires: "2024-06-15",
      priority: "Media",
      featured: false,
    },
    {
      id: 5,
      title: "Gerente de Proyecto",
      department: "Administración",
      type: "Tiempo Completo",
      location: "Cancún, Q.Roo",
      salary: "$35,000 - $45,000",
      status: "Borrador",
      applications: 0,
      views: 0,
      posted: null,
      expires: null,
      priority: "Alta",
      featured: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activa":
        return "bg-green-100 text-green-800"
      case "Pausada":
        return "bg-yellow-100 text-yellow-800"
      case "Expirada":
        return "bg-red-100 text-red-800"
      case "Borrador":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = [
    {
      icon: CheckCircle,
      value: jobs.filter((job) => job.status === "Activa").length,
      label: "Vacantes Activas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Users,
      value: jobs.reduce((sum, job) => sum + job.applications, 0),
      label: "Total Postulantes",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Eye,
      value: jobs.reduce((sum, job) => sum + job.views, 0),
      label: "Total Visualizaciones",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: AlertCircle,
      value: jobs.filter((job) => job.status === "Expirada").length,
      label: "Vacantes Expiradas",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestionar Vacantes</h1>
          <p className="text-muted-foreground">Administra todas tus ofertas laborales</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Reportes
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Vacante
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar vacantes..." className="pl-10 h-12" />
            </div>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
                <SelectItem value="expired">Expiradas</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-departments">
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-departments">Todos los departamentos</SelectItem>
                <SelectItem value="tech">Tecnología</SelectItem>
                <SelectItem value="design">Diseño</SelectItem>
                <SelectItem value="admin">Administración</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más Recientes</SelectItem>
                <SelectItem value="oldest">Más Antiguas</SelectItem>
                <SelectItem value="applications">Más Postulaciones</SelectItem>
                <SelectItem value="views">Más Vistas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas ({jobs.length})</TabsTrigger>
          <TabsTrigger value="active">Activas ({jobs.filter((job) => job.status === "Activa").length})</TabsTrigger>
          <TabsTrigger value="paused">Pausadas ({jobs.filter((job) => job.status === "Pausada").length})</TabsTrigger>
          <TabsTrigger value="expired">
            Expiradas ({jobs.filter((job) => job.status === "Expirada").length})
          </TabsTrigger>
          <TabsTrigger value="draft">Borradores ({jobs.filter((job) => job.status === "Borrador").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {job.featured && <Badge className="bg-primary/10 text-primary">Destacada</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{job.department}</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      {job.posted && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Publicado {new Date(job.posted).toLocaleDateString("es-ES")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    <Badge variant="outline" className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.status === "Activa" ? (
                          <DropdownMenuItem>
                            <Pause className="mr-2 h-4 w-4" />
                            Pausar
                          </DropdownMenuItem>
                        ) : job.status === "Pausada" ? (
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            Reactivar
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Badge variant="secondary">{job.type}</Badge>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{job.applications} postulantes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{job.views} visualizaciones</span>
                      </div>
                      {job.expires && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Expira {new Date(job.expires).toLocaleDateString("es-ES")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {job.status === "Expirada" && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Esta vacante ha expirado. Puedes renovarla o crear una nueva versión.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Ver Postulantes ({job.applications})
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Estadísticas
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    {job.status === "Activa" && (
                      <Button variant="outline" size="sm">
                        <Pause className="mr-2 h-4 w-4" />
                        Pausar
                      </Button>
                    )}
                    {job.status === "Pausada" && (
                      <Button size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Reactivar
                      </Button>
                    )}
                    {job.status === "Expirada" && (
                      <Button size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Renovar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would filter the jobs array accordingly */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {jobs
            .filter((job) => job.status === "Activa")
            .map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-green-200 bg-green-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.department} • {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activa</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{job.applications} postulantes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{job.views} visualizaciones</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Ver Postulantes
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4 mt-6">
          {jobs
            .filter((job) => job.status === "Pausada")
            .map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-yellow-200 bg-yellow-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.department} • {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pausada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Esta vacante está pausada y no es visible para los candidatos.</AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Reactivar
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4 mt-6">
          {jobs
            .filter((job) => job.status === "Expirada")
            .map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.department} • {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Expirada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Esta vacante expiró el {job.expires && new Date(job.expires).toLocaleDateString("es-ES")}.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Renovar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4 mt-6">
          {jobs
            .filter((job) => job.status === "Borrador")
            .map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-dashed">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.department} • {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Esta vacante está en borrador y no ha sido publicada.</AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Completar y Publicar
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
