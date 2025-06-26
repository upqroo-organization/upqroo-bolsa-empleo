"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Eye,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Award,
  Target,
} from "lucide-react"

export default function StudentTracking() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  type Student = typeof students[number]
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const stats = [
    { title: "Total Estudiantes", value: "1,247", color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Activos", value: "1,089", color: "text-green-600", bgColor: "bg-green-100" },
    { title: "En Proceso", value: "234", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { title: "Colocados", value: "73", color: "text-purple-600", bgColor: "bg-purple-100" },
    { title: "Inactivos", value: "85", color: "text-red-600", bgColor: "bg-red-100" },
  ]

  const students = [
    {
      id: 1,
      name: "Ana Rodríguez García",
      email: "ana.rodriguez@upqroo.edu.mx",
      phone: "+52 983 123 4567",
      career: "Ingeniería en Sistemas Computacionales",
      semester: "8vo Semestre",
      gpa: 9.2,
      status: "active",
      lastActivity: "2024-01-15",
      applications: 12,
      interviews: 5,
      offers: 2,
      skills: ["React", "Node.js", "Python", "MySQL"],
      avatar: "/placeholder.svg?height=40&width=40",
      progress: {
        profile: 95,
        applications: 80,
        interviews: 60,
      },
      alerts: [
        { type: "success", message: "Entrevista programada para mañana" },
        { type: "info", message: "Nueva vacante recomendada" },
      ],
    },
    {
      id: 2,
      name: "Luis Martínez Pérez",
      email: "luis.martinez@upqroo.edu.mx",
      phone: "+52 983 987 6543",
      career: "Ingeniería Industrial",
      semester: "7mo Semestre",
      gpa: 8.9,
      status: "in-process",
      lastActivity: "2024-01-14",
      applications: 8,
      interviews: 3,
      offers: 1,
      skills: ["Lean Manufacturing", "Six Sigma", "AutoCAD", "Excel"],
      avatar: "/placeholder.svg?height=40&width=40",
      progress: {
        profile: 85,
        applications: 70,
        interviews: 40,
      },
      alerts: [{ type: "warning", message: "Perfil incompleto - faltan certificaciones" }],
    },
    {
      id: 3,
      name: "Sofia Chen Wang",
      email: "sofia.chen@upqroo.edu.mx",
      phone: "+52 983 456 7890",
      career: "Ingeniería Ambiental",
      semester: "6to Semestre",
      gpa: 9.5,
      status: "placed",
      lastActivity: "2024-01-10",
      applications: 15,
      interviews: 7,
      offers: 3,
      skills: ["Gestión Ambiental", "GIS", "Sustentabilidad", "Análisis de Agua"],
      avatar: "/placeholder.svg?height=40&width=40",
      progress: {
        profile: 100,
        applications: 90,
        interviews: 85,
      },
      placedAt: "EcoSolutions S.A.",
      placedDate: "2024-01-05",
      alerts: [],
    },
    {
      id: 4,
      name: "Carlos Hernández López",
      email: "carlos.hernandez@upqroo.edu.mx",
      phone: "+52 983 321 6547",
      career: "Ingeniería en Energías Renovables",
      semester: "9no Semestre",
      gpa: 8.7,
      status: "inactive",
      lastActivity: "2023-12-15",
      applications: 3,
      interviews: 1,
      offers: 0,
      skills: ["Energía Solar", "Eólica", "Biomasa", "MATLAB"],
      avatar: "/placeholder.svg?height=40&width=40",
      progress: {
        profile: 60,
        applications: 30,
        interviews: 10,
      },
      alerts: [
        { type: "error", message: "Sin actividad por más de 30 días" },
        { type: "warning", message: "Perfil incompleto" },
      ],
    },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.career.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && student.status === activeTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "in-process":
        return <Badge className="bg-yellow-100 text-yellow-800">En Proceso</Badge>
      case "placed":
        return <Badge className="bg-purple-100 text-purple-800">Colocado</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactivo</Badge>
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-process":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "placed":
        return <Award className="h-4 w-4 text-purple-600" />
      case "inactive":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Seguimiento de Estudiantes</h1>
          <p className="text-muted-foreground">Monitoreo y gestión del progreso estudiantil en la bolsa de trabajo</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Enviar Mensaje
          </Button>
          <Button size="sm">
            <Target className="h-4 w-4 mr-2" />
            Crear Alerta
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Users className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar estudiantes por nombre, carrera o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por carrera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las carreras</SelectItem>
            <SelectItem value="sistemas">Ing. en Sistemas</SelectItem>
            <SelectItem value="industrial">Ing. Industrial</SelectItem>
            <SelectItem value="ambiental">Ing. Ambiental</SelectItem>
            <SelectItem value="renovables">Ing. en Energías Renovables</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="6">6to</SelectItem>
            <SelectItem value="7">7mo</SelectItem>
            <SelectItem value="8">8vo</SelectItem>
            <SelectItem value="9">9no</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({students.length})</TabsTrigger>
          <TabsTrigger value="active">Activos ({students.filter((s) => s.status === "active").length})</TabsTrigger>
          <TabsTrigger value="in-process">
            En Proceso ({students.filter((s) => s.status === "in-process").length})
          </TabsTrigger>
          <TabsTrigger value="placed">Colocados ({students.filter((s) => s.status === "placed").length})</TabsTrigger>
          <TabsTrigger value="inactive">
            Inactivos ({students.filter((s) => s.status === "inactive").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredStudents.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        {getStatusBadge(student.status)}
                        {student.alerts.length > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            {student.alerts.length} alerta{student.alerts.length > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {student.career}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {student.semester}
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          Promedio: {student.gpa}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-blue-600" />
                          {student.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-green-600" />
                          {student.phone}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-600" />
                          Última actividad: {student.lastActivity}
                        </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Perfil Completo</span>
                          <span>{student.progress.profile}%</span>
                        </div>
                        <Progress value={student.progress.profile} className="h-2" />

                        <div className="flex items-center justify-between text-sm">
                          <span>Actividad de Postulaciones</span>
                          <span>{student.progress.applications}%</span>
                        </div>
                        <Progress value={student.progress.applications} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span>{student.applications} postulaciones</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-green-600" />
                          <span>{student.interviews} entrevistas</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-purple-600" />
                          <span>{student.offers} ofertas</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Habilidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {student.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Alerts */}
                      {student.alerts.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {student.alerts.map((alert, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 p-2 rounded text-sm ${
                                alert.type === "success"
                                  ? "bg-green-50 text-green-700"
                                  : alert.type === "warning"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : alert.type === "error"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {alert.type === "success" && <CheckCircle className="h-4 w-4" />}
                              {alert.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                              {alert.type === "error" && <AlertTriangle className="h-4 w-4" />}
                              {alert.type === "info" && <Clock className="h-4 w-4" />}
                              <span>{alert.message}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Placement Info */}
                      {student.status === "placed" && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-purple-800">Colocado en {student.placedAt}</span>
                            <Badge variant="outline" className="text-purple-600">
                              {student.placedDate}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Perfil
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedStudent?.name}</DialogTitle>
                          <DialogDescription>Perfil completo del estudiante</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Información Académica</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Carrera:</strong> {selectedStudent?.career}
                                </p>
                                <p>
                                  <strong>Semestre:</strong> {selectedStudent?.semester}
                                </p>
                                <p>
                                  <strong>Promedio:</strong> {selectedStudent?.gpa}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Actividad Laboral</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <strong>Postulaciones:</strong> {selectedStudent?.applications}
                                </p>
                                <p>
                                  <strong>Entrevistas:</strong> {selectedStudent?.interviews}
                                </p>
                                <p>
                                  <strong>Ofertas:</strong> {selectedStudent?.offers}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Progreso</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Perfil Completo</span>
                                  <span>{selectedStudent?.progress.profile}%</span>
                                </div>
                                <Progress value={selectedStudent?.progress.profile} />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Actividad de Postulaciones</span>
                                  <span>{selectedStudent?.progress.applications}%</span>
                                </div>
                                <Progress value={selectedStudent?.progress.applications} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
