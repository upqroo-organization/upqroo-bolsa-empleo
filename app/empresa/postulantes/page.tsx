import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Star,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

export default function Applicants() {
  const applicants = [
    {
      id: 1,
      name: "Ana García López",
      email: "ana.garcia@upqroo.edu.mx",
      phone: "(998) 123-4567",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Desarrollador Frontend React",
      appliedDate: "2024-06-12",
      status: "Nuevo",
      match: 95,
      career: "Ingeniería en Software",
      semester: "8vo Semestre",
      gpa: 8.7,
      skills: ["React", "JavaScript", "CSS", "Git", "Node.js"],
      experience: "6 meses",
      location: "Cancún, Q.Roo",
      notes: "",
    },
    {
      id: 2,
      name: "Carlos Mendoza Ruiz",
      email: "carlos.mendoza@upqroo.edu.mx",
      phone: "(998) 234-5678",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Desarrollador Frontend React",
      appliedDate: "2024-06-11",
      status: "En revisión",
      match: 88,
      career: "Ingeniería en Software",
      semester: "9vo Semestre",
      gpa: 8.9,
      skills: ["React", "TypeScript", "CSS", "Git"],
      experience: "1 año",
      location: "Playa del Carmen, Q.Roo",
      notes: "Experiencia previa en startup local",
    },
    {
      id: 3,
      name: "María Fernández Castro",
      email: "maria.fernandez@upqroo.edu.mx",
      phone: "(998) 345-6789",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Analista de Datos Jr",
      appliedDate: "2024-06-10",
      status: "Entrevista programada",
      match: 92,
      career: "Ingeniería en Sistemas",
      semester: "Egresada",
      gpa: 9.1,
      skills: ["Python", "SQL", "Excel", "Power BI", "Tableau"],
      experience: "8 meses",
      location: "Cancún, Q.Roo",
      notes: "Entrevista programada para el 15 de junio",
    },
    {
      id: 4,
      name: "Luis Alberto Pérez",
      email: "luis.perez@upqroo.edu.mx",
      phone: "(998) 456-7890",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Desarrollador Frontend React",
      appliedDate: "2024-06-09",
      status: "Rechazado",
      match: 65,
      career: "Ingeniería en Software",
      semester: "6to Semestre",
      gpa: 7.8,
      skills: ["HTML", "CSS", "JavaScript"],
      experience: "Sin experiencia",
      location: "Cozumel, Q.Roo",
      notes: "No cumple con los requisitos mínimos de React",
    },
    {
      id: 5,
      name: "Sofia Ramírez González",
      email: "sofia.ramirez@upqroo.edu.mx",
      phone: "(998) 567-8901",
      avatar: "/placeholder.svg?height=40&width=40",
      position: "Diseñador UX/UI",
      appliedDate: "2024-06-08",
      status: "Contratado",
      match: 96,
      career: "Diseño Gráfico",
      semester: "Egresada",
      gpa: 9.3,
      skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Prototyping"],
      experience: "1.5 años",
      location: "Cancún, Q.Roo",
      notes: "Excelente portafolio, contratada para inicio inmediato",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nuevo":
        return "bg-blue-100 text-blue-800"
      case "En revisión":
        return "bg-yellow-100 text-yellow-800"
      case "Entrevista programada":
        return "bg-purple-100 text-purple-800"
      case "Contratado":
        return "bg-green-100 text-green-800"
      case "Rechazado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600"
    if (match >= 75) return "text-yellow-600"
    return "text-red-600"
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
      value: applicants.filter((app) => app.status === "Nuevo").length,
      label: "Nuevos",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Calendar,
      value: applicants.filter((app) => app.status === "Entrevista programada").length,
      label: "Entrevistas",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: CheckCircle,
      value: applicants.filter((app) => app.status === "Contratado").length,
      label: "Contratados",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

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
                <SelectItem value="new">Nuevos</SelectItem>
                <SelectItem value="review">En revisión</SelectItem>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todos ({applicants.length})</TabsTrigger>
          <TabsTrigger value="new">Nuevos ({applicants.filter((app) => app.status === "Nuevo").length})</TabsTrigger>
          <TabsTrigger value="review">
            En Revisión ({applicants.filter((app) => app.status === "En revisión").length})
          </TabsTrigger>
          <TabsTrigger value="interview">
            Entrevistas ({applicants.filter((app) => app.status === "Entrevista programada").length})
          </TabsTrigger>
          <TabsTrigger value="hired">
            Contratados ({applicants.filter((app) => app.status === "Contratado").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rechazados ({applicants.filter((app) => app.status === "Rechazado").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {applicants.map((applicant) => (
            <Card key={applicant.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {applicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{applicant.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className={`text-sm font-medium ${getMatchColor(applicant.match)}`}>
                            {applicant.match}% match
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">{applicant.position}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {applicant.career} - {applicant.semester}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {applicant.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Postulado {new Date(applicant.appliedDate).toLocaleDateString("es-ES")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(applicant.status)}>{applicant.status}</Badge>
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
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Descargar CV
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Programar Entrevista
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Aprobar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Rechazar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{applicant.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{applicant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Promedio: {applicant.gpa}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Habilidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Compatibilidad con el puesto:</p>
                    <div className="flex items-center gap-3">
                      <Progress value={applicant.match} className="flex-1 h-2" />
                      <span className={`text-sm font-medium ${getMatchColor(applicant.match)}`}>
                        {applicant.match}%
                      </span>
                    </div>
                  </div>

                  {applicant.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <strong>Notas:</strong> {applicant.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Perfil
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar CV
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contactar
                    </Button>
                    {applicant.status === "Nuevo" && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprobar
                      </Button>
                    )}
                    {applicant.status === "En revisión" && (
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Programar Entrevista
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* New Applicants */}
        <TabsContent value="new" className="space-y-4 mt-6">
          {applicants
            .filter((app) => app.status === "Nuevo")
            .map((applicant) => (
              <Card key={applicant.id} className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{applicant.name}</CardTitle>
                        <CardDescription>
                          {applicant.position} • {applicant.career}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{applicant.match}%</span>
                      </div>
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
            ))}
        </TabsContent>

        {/* Interview Scheduled */}
        <TabsContent value="interview" className="space-y-4 mt-6">
          {applicants
            .filter((app) => app.status === "Entrevista programada")
            .map((applicant) => (
              <Card key={applicant.id} className="border-purple-200 bg-purple-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{applicant.name}</CardTitle>
                        <CardDescription>
                          {applicant.position} • {applicant.career}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Entrevista Programada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {applicant.notes && (
                    <div className="p-3 bg-purple-100 rounded-lg mb-4">
                      <p className="text-sm text-purple-800">
                        <strong>Próxima entrevista:</strong> {applicant.notes}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Detalles Entrevista
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contactar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Hired */}
        <TabsContent value="hired" className="space-y-4 mt-6">
          {applicants
            .filter((app) => app.status === "Contratado")
            .map((applicant) => (
              <Card key={applicant.id} className="border-green-200 bg-green-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{applicant.name}</CardTitle>
                        <CardDescription>
                          {applicant.position} • {applicant.career}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Contratado</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {applicant.notes && (
                    <div className="p-3 bg-green-100 rounded-lg mb-4">
                      <p className="text-sm text-green-800">{applicant.notes}</p>
                    </div>
                  )}
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
            ))}
        </TabsContent>

        {/* Rejected */}
        <TabsContent value="rejected" className="space-y-4 mt-6">
          {applicants
            .filter((app) => app.status === "Rechazado")
            .map((applicant) => (
              <Card key={applicant.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={applicant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{applicant.name}</CardTitle>
                        <CardDescription>
                          {applicant.position} • {applicant.career}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {applicant.notes && (
                    <div className="p-3 bg-red-50 rounded-lg mb-4">
                      <p className="text-sm text-red-800">
                        <strong>Motivo:</strong> {applicant.notes}
                      </p>
                    </div>
                  )}
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
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
