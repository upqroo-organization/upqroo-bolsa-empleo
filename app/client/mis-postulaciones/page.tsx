'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Calendar, Eye, X, Clock, FileText, Users } from "lucide-react"
import Link from "next/link"
import { useMyApplications, ApplicationWithVacante } from "@/hooks/useMyApplications"
import { useState } from "react"
import { Spinner } from "@/components/Spinner"
import ApplicationCard from "@/components/ApplicationCard"
import JobApplicationDrawer from "@/components/JobApplicationDrawer"
export default function MyApplications() {
  const { 
    applications, 
    isLoading, 
    error, 
    getStatusCount, 
    getActiveCount, 
    getApplicationsByStatus, 
    getActiveApplications 
  } = useMyApplications()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithVacante | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = searchTerm === "" || 
        app.vacante.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.vacante.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        case 'oldest':
          return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        case 'company':
          return a.vacante.company.name.localeCompare(b.vacante.company.name)
        default:
          return 0
      }
    })

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
      value: getStatusCount("pending"),
      label: "Pendientes",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Users,
      value: getStatusCount("accepted"),
      label: "Aceptadas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: X,
      value: getStatusCount("rejected"),
      label: "Rechazadas",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  if (error) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-red-600">
            <X className="h-12 w-12 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold">Error al cargar postulaciones</h2>
          <p className="text-muted-foreground text-center">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Postulaciones</h1>
          <p className="text-muted-foreground">Seguimiento de todas tus aplicaciones laborales</p>
        </div>
        <Link href={"/vacantes"}>
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Buscar Vacantes
          </Button>
        </Link>
      </div>
      
      {/* Job Application Drawer */}
      <JobApplicationDrawer
        application={selectedApplication}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-200 p-3 rounded-lg">
                    <div className="h-6 w-6 bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 w-12 bg-gray-300 rounded" />
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => {
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
          })
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por empresa o puesto..." 
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="accepted">Aceptadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Todas ({applications.length})</span>
            <span className="sm:hidden">Todas</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Activas ({getActiveCount()})</span>
            <span className="sm:hidden">Activas</span>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Aceptadas ({getStatusCount("accepted")})</span>
            <span className="sm:hidden">Aceptadas</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Rechazadas ({getStatusCount("rejected")})</span>
            <span className="sm:hidden">Rechazadas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay postulaciones</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "No se encontraron postulaciones con los filtros aplicados"
                  : "Aún no has aplicado a ninguna vacante"
                }
              </p>
              <Link href="/vacantes">
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Vacantes
                </Button>
              </Link>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application}
                onViewDetails={(app) => {
                  setSelectedApplication(app)
                  setIsDrawerOpen(true)
                }}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : getActiveApplications().length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay postulaciones activas</h3>
              <p className="text-muted-foreground mb-4">
                Todas tus postulaciones han sido procesadas
              </p>
            </div>
          ) : (
            getActiveApplications().map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application}
                onViewDetails={(app) => {
                  setSelectedApplication(app)
                  setIsDrawerOpen(true)
                }}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : getApplicationsByStatus("accepted").length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay postulaciones aceptadas</h3>
              <p className="text-muted-foreground mb-4">
                Aún no tienes postulaciones aceptadas
              </p>
            </div>
          ) : (
            getApplicationsByStatus("accepted").map((application) => (
              <Card key={application.id} className="border-green-200 bg-green-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.vacante.title}</CardTitle>
                      <CardDescription>
                        {application.vacante.company.name} • {application.vacante.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Aceptada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <strong>¡Felicidades!</strong> Tu postulación ha sido aceptada. 
                      La empresa se pondrá en contacto contigo pronto.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application)
                        setIsDrawerOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm">
                      Contactar Empresa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : getApplicationsByStatus("rejected").length === 0 ? (
            <div className="text-center py-12">
              <X className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay postulaciones rechazadas</h3>
              <p className="text-muted-foreground mb-4">
                Ninguna de tus postulaciones ha sido rechazada
              </p>
            </div>
          ) : (
            getApplicationsByStatus("rejected").map((application) => (
              <Card key={application.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.vacante.title}</CardTitle>
                      <CardDescription>
                        {application.vacante.company.name} • {application.vacante.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Rechazada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertDescription>
                      Esta postulación no fue seleccionada. No te desanimes, 
                      sigue aplicando a más oportunidades.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application)
                        setIsDrawerOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                    <Link href="/vacantes">
                      <Button variant="outline" size="sm">
                        Buscar Similar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
