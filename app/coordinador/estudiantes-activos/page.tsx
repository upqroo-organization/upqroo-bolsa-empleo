"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Search,
  ArrowLeft,
  Mail,
  Calendar,
  GraduationCap,
  MapPin,
  Phone,
  Eye,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  image?: string
  career: string
  semester: number
  registrationDate: string
  status: string
  phone?: string
  location?: string
  cvUrl?: string
  applicationsCount: number
  interviewsCount: number
  hiredCount: number
}

export default function EstudiantesActivos() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/coordinador/estudiantes-activos")

      if (!response.ok) {
        throw new Error("Error al cargar los estudiantes")
      }

      const result = await response.json()
      if (result.success) {
        setStudents(result.data)
      } else {
        setError(result.error || "Error desconocido")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      case "graduated":
        return "Graduado"
      default:
        return status
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.career.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchStudents}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 md:h-8 w-8 text-blue-600" />
            Estudiantes Activos
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Lista completa de estudiantes registrados en la plataforma ({filteredStudents.length} estudiantes)
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{students.filter(s => s.status === "active").length}</p>
                <p className="text-xs text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.applicationsCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Postulaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.hiredCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Contratados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o carrera..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
                <SelectItem value="graduated">Graduados</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Tabla</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Display */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron estudiantes</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay estudiantes registrados en el sistema"}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        // Cards View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.image || "/placeholder.svg"} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                  {student.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{student.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Registrado: {formatDate(student.registrationDate)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="font-semibold text-blue-600">{student.applicationsCount}</p>
                    <p className="text-muted-foreground">Postulaciones</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="font-semibold text-purple-600">{student.interviewsCount}</p>
                    <p className="text-muted-foreground">Entrevistas</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-semibold text-green-600">{student.hiredCount}</p>
                    <p className="text-muted-foreground">Contratado</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {student.cvUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // Extract filename from cvUrl and construct API URL
                        const filename = student.cvUrl.split('/').pop() || student.cvUrl
                        const apiUrl = `/api/uploads/cvs/${filename}`
                        window.open(apiUrl, '_blank')
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver CV
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Table View
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Estudiante</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Postulaciones</TableHead>
                    <TableHead className="text-center">Entrevistas</TableHead>
                    <TableHead className="text-center">Contratado</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead className="text-center">CV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.image || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{student.career}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{student.email}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusLabel(student.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-blue-600">
                          {student.applicationsCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-purple-600">
                          {student.interviewsCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-green-600">
                          {student.hiredCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(student.registrationDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {student.cvUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Extract filename from cvUrl and construct API URL
                              const filename = student.cvUrl.split('/').pop() || student.cvUrl
                              const apiUrl = `/api/uploads/cvs/${filename}`
                              window.open(apiUrl, '_blank')
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin CV</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}