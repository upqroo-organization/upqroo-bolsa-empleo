"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Download,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Eye,
  MessageSquare,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Types for our data
interface ApplicantData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  cvUrl: string | null
  position: string
  appliedDate: Date
  status: string
  vacanteId: string
  cvViewed: boolean
  hiredAt: Date | null
  career: string | null
  notes?: string | null
}

export default function Applicants() {
  const router = useRouter();
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/empresa/postulantes');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/signin');
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setApplicants(data.applicants);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError('Error al cargar los postulantes. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "hired":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "interview":
        return "Entrevista"
      case "hired":
        return "Contratado"
      case "rejected":
        return "Rechazado"
      default:
        return status
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const stats = [
    {
      icon: Users,
      value: applicants.length,
      label: "Total Postulantes",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      value: applicants.filter((app) => app.status === "pending").length,
      label: "Pendientes",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Calendar,
      value: applicants.filter((app) => app.status === "interview").length,
      label: "Entrevistas",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: CheckCircle,
      value: applicants.filter((app) => app.status === "hired").length,
      label: "Contratados",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando postulantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Postulantes</h1>
          <p className="text-muted-foreground">Gestiona los candidatos a tus vacantes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CV
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
              <Input placeholder="Buscar por nombre, carrera o habilidades..." className="pl-10 h-12" />
            </div>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="interview">Entrevista</SelectItem>
                <SelectItem value="hired">Contratados</SelectItem>
                <SelectItem value="rejected">Rechazados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({applicants.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({applicants.filter((app) => app.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="interview">
            Entrevistas ({applicants.filter((app) => app.status === "interview").length})
          </TabsTrigger>
          <TabsTrigger value="hired">
            Contratados ({applicants.filter((app) => app.status === "hired").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rechazados ({applicants.filter((app) => app.status === "rejected").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {applicants.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay postulantes</h3>
                <p className="text-muted-foreground">Aún no tienes postulantes para tus vacantes.</p>
              </CardContent>
            </Card>
          ) : (
            applicants.map((applicant) => (
              <Card key={applicant.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={applicant.image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {applicant.name
                            ? applicant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{applicant.name || "Sin nombre"}</CardTitle>
                          {!applicant.cvViewed && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">{applicant.position}</p>
                          {applicant.career && (
                            <p className="text-sm text-muted-foreground">{applicant.career}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Postulado {formatDate(applicant.appliedDate)}
                            </div>
                            {applicant.hiredAt && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Contratado {formatDate(applicant.hiredAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(applicant.status)}>
                        {getStatusLabel(applicant.status)}
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
                            Ver Perfil Completo
                          </DropdownMenuItem>
                          {applicant.cvUrl && (
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Descargar CV
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Programar Entrevista
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {applicant.status === "pending" && (
                            <>
                              <DropdownMenuItem>
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Aprobar para Entrevista
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Rechazar
                              </DropdownMenuItem>
                            </>
                          )}
                          {applicant.status === "interview" && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Contratar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{applicant.email || "Sin email"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{applicant.cvUrl ? "CV disponible" : "Sin CV"}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </Button>
                      {applicant.cvUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Descargar CV
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contactar
                      </Button>
                      {applicant.status === "pending" && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Aprobar
                        </Button>
                      )}
                      {applicant.status === "interview" && (
                        <Button size="sm">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Contratar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Pending Applicants */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          {applicants.filter((app) => app.status === "pending").length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay postulantes pendientes</h3>
                <p className="text-muted-foreground">No tienes postulantes pendientes de revisión.</p>
              </CardContent>
            </Card>
          ) : (
            applicants
              .filter((app) => app.status === "pending")
              .map((applicant) => (
                <Card key={applicant.id} className="border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={applicant.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {applicant.name
                              ? applicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{applicant.name || "Sin nombre"}</CardTitle>
                          <CardDescription>
                            {applicant.position}
                            {applicant.career && ` • ${applicant.career}`}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-1">
                            Postulado {formatDate(applicant.appliedDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Pendiente</Badge>
                        {!applicant.cvViewed && (
                          <Badge variant="outline" className="text-xs">
                            Sin revisar
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Revisar Perfil
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Interview Scheduled */}
        <TabsContent value="interview" className="space-y-4 mt-6">
          {applicants.filter((app) => app.status === "interview").length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay entrevistas programadas</h3>
                <p className="text-muted-foreground">No tienes candidatos en fase de entrevista.</p>
              </CardContent>
            </Card>
          ) : (
            applicants
              .filter((app) => app.status === "interview")
              .map((applicant) => (
                <Card key={applicant.id} className="border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={applicant.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {applicant.name
                              ? applicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{applicant.name || "Sin nombre"}</CardTitle>
                          <CardDescription>
                            {applicant.position}
                            {applicant.career && ` • ${applicant.career}`}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Entrevista</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Ver Detalles Entrevista
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contactar
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Contratar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Hired */}
        <TabsContent value="hired" className="space-y-4 mt-6">
          {applicants.filter((app) => app.status === "hired").length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay candidatos contratados</h3>
                <p className="text-muted-foreground">Aún no has contratado a ningún candidato.</p>
              </CardContent>
            </Card>
          ) : (
            applicants
              .filter((app) => app.status === "hired")
              .map((applicant) => (
                <Card key={applicant.id} className="border-green-200 bg-green-50/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={applicant.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {applicant.name
                              ? applicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{applicant.name || "Sin nombre"}</CardTitle>
                          <CardDescription>
                            {applicant.position}
                            {applicant.career && ` • ${applicant.career}`}
                          </CardDescription>
                          {applicant.hiredAt && (
                            <p className="text-xs text-green-700 mt-1">
                              Contratado el {formatDate(applicant.hiredAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Contratado</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Generar Contrato
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected" className="space-y-4 mt-6">
          {applicants.filter((app) => app.status === "rejected").length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay candidatos rechazados</h3>
                <p className="text-muted-foreground">No has rechazado a ningún candidato.</p>
              </CardContent>
            </Card>
          ) : (
            applicants
              .filter((app) => app.status === "rejected")
              .map((applicant) => (
                <Card key={applicant.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={applicant.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {applicant.name
                              ? applicant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{applicant.name || "Sin nombre"}</CardTitle>
                          <CardDescription>
                            {applicant.position}
                            {applicant.career && ` • ${applicant.career}`}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </Button>
                      <Button variant="outline" size="sm">
                        Reconsiderar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}