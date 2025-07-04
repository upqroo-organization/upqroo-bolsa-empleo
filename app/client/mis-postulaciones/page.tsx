import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Calendar, Building2, MapPin, Eye, MessageSquare, X, Clock, FileText, Users } from "lucide-react"
export default function MyApplications() {
  const applications = [
    {
      id: 1,
      title: "Desarrollador Frontend React",
      company: "TechCorp México",
      location: "Cancún, Q.Roo",
      appliedDate: "2024-06-10",
      status: "En revisión",
      statusColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
      salary: "$25,000 - $35,000",
      type: "Tiempo Completo",
      lastUpdate: "Hace 2 días",
      notes: "Entrevista técnica programada para el viernes",
      priority: "high",
    },
    {
      id: 2,
      title: "Analista de Datos Jr",
      company: "DataSolutions",
      location: "Playa del Carmen",
      appliedDate: "2024-06-08",
      status: "Entrevista programada",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200",
      salary: "$8,000 - $12,000",
      type: "Prácticas",
      lastUpdate: "Hace 1 día",
      notes: "Entrevista virtual el lunes 17 de junio a las 10:00 AM",
      priority: "high",
    },
    {
      id: 3,
      title: "Ingeniero de Software Jr",
      company: "Innovation Labs",
      location: "Remoto",
      appliedDate: "2024-06-05",
      status: "Rechazada",
      statusColor: "bg-red-100 text-red-800 border-red-200",
      salary: "$30,000 - $45,000",
      type: "Tiempo Completo",
      lastUpdate: "Hace 3 días",
      notes: "Perfil no coincide con los requisitos actuales",
      priority: "low",
    },
    {
      id: 4,
      title: "Desarrollador Full Stack",
      company: "StartupTech",
      location: "Cancún, Q.Roo",
      appliedDate: "2024-06-12",
      status: "Postulación enviada",
      statusColor: "bg-gray-100 text-gray-800 border-gray-200",
      salary: "$22,000 - $30,000",
      type: "Tiempo Completo",
      lastUpdate: "Hace 2 horas",
      notes: "",
      priority: "medium",
    },
    {
      id: 5,
      title: "Diseñador UX/UI",
      company: "Creative Studio",
      location: "Cozumel, Q.Roo",
      appliedDate: "2024-06-01",
      status: "Finalista",
      statusColor: "bg-green-100 text-green-800 border-green-200",
      salary: "$15,000 - $20,000",
      type: "Medio Tiempo",
      lastUpdate: "Hace 1 semana",
      notes: "Esperando decisión final entre 3 candidatos",
      priority: "high",
    },
  ]

  const getStatusCount = (status: string) => {
    return applications.filter((app) => app.status === status).length
  }

  const getActiveCount = () => {
    return applications.filter((app) => !["Rechazada"].includes(app.status)).length
  }

  const stats = [
    {
      icon: FileText,
      value: applications.length,
      label: "Total Postulaciones",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      value: getStatusCount("En revisión"),
      label: "En Revisión",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Users,
      value: getStatusCount("Entrevista programada") + getStatusCount("Finalista"),
      label: "En Proceso",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: X,
      value: getStatusCount("Rechazada"),
      label: "Rechazadas",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Postulaciones</h1>
          <p className="text-muted-foreground">Seguimiento de todas tus aplicaciones laborales</p>
        </div>
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Buscar Más Empleos
        </Button>
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
              <Input placeholder="Buscar por empresa o puesto..." className="pl-10 h-12" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Postulación enviada</SelectItem>
                <SelectItem value="review">En revisión</SelectItem>
                <SelectItem value="interview">Entrevista programada</SelectItem>
                <SelectItem value="finalist">Finalista</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más Recientes</SelectItem>
                <SelectItem value="oldest">Más Antiguas</SelectItem>
                <SelectItem value="company">Por Empresa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({applications.length})</TabsTrigger>
          <TabsTrigger value="active">Activas ({getActiveCount()})</TabsTrigger>
          <TabsTrigger value="interviews">Entrevistas ({getStatusCount("Entrevista programada")})</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas ({getStatusCount("Rechazada")})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{application.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {application.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {application.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Postulado el {new Date(application.appliedDate).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={application.statusColor}>{application.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge variant="secondary">{application.type}</Badge>
                    <span className="text-green-600 font-semibold">{application.salary}</span>
                    <span className="text-muted-foreground">Actualizado {application.lastUpdate}</span>
                  </div>

                  {application.notes && (
                    <Alert>
                      <AlertDescription>
                        <strong>Nota:</strong> {application.notes}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contactar
                    </Button>
                    {application.status === "Entrevista programada" && (
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver Entrevista
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-6">
          {applications
            .filter((app) => !["Rechazada"].includes(app.status))
            .map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.title}</CardTitle>
                      <CardDescription>
                        {application.company} • {application.location}
                      </CardDescription>
                    </div>
                    <Badge className={application.statusColor}>{application.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      Contactar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4 mt-6">
          {applications
            .filter((app) => app.status === "Entrevista programada")
            .map((application) => (
              <Card key={application.id} className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.title}</CardTitle>
                      <CardDescription>
                        {application.company} • {application.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Entrevista Programada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Próxima entrevista:</strong> {application.notes}
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Button size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Detalles de Entrevista
                    </Button>
                    <Button variant="outline" size="sm">
                      Preparación
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {applications
            .filter((app) => app.status === "Rechazada")
            .map((application) => (
              <Card key={application.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.title}</CardTitle>
                      <CardDescription>
                        {application.company} • {application.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Rechazada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {application.notes && (
                    <Alert className="mb-4">
                      <AlertDescription>{application.notes}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      Ver Feedback
                    </Button>
                    <Button variant="outline" size="sm">
                      Buscar Similar
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
