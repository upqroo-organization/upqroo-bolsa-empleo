"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  TrendingUp,
  Search,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Building2,
  Eye,
  Filter,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle,
  Grid3X3,
  List,
  Mail,
  Clock,
  Star,
  FileText,
  Download,
} from "lucide-react"

interface Colocacion {
  id: string
  student: {
    id: string
    name: string
    email: string
    image?: string
    career: string
    semester: number
  }
  company: {
    id: string
    name: string
    sector: string
    size: string
  }
  vacante: {
    id: string
    title: string
    type: string
    modality: string
    location: string
    salaryMin?: number
    salaryMax?: number
  }
  hiredDate: string
  startDate?: string
  status: string
  performance?: number
  notes?: string
}

export default function ColocacionesExitosas() {
  const router = useRouter()
  const [colocaciones, setColocaciones] = useState<Colocacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [careerFilter, setCareerFilter] = useState("all")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  // Modal state
  const [selectedColocacion, setSelectedColocacion] = useState<Colocacion | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchColocaciones()
  }, [])

  const fetchColocaciones = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/coordinador/colocaciones-exitosas")

      if (!response.ok) {
        throw new Error("Error al cargar las colocaciones")
      }

      const result = await response.json()
      if (result.success) {
        setColocaciones(result.data)
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

  const formatSalary = (salaryMin?: number, salaryMax?: number) => {
    if (!salaryMin && !salaryMax) return 'No especificado'
    if (salaryMin && salaryMax) return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`
    if (salaryMin) return `Desde $${salaryMin.toLocaleString()}`
    if (salaryMax) return `Hasta $${salaryMax.toLocaleString()}`
    return 'No especificado'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "completed":
        return "Completado"
      case "terminated":
        return "Terminado"
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "fullTime":
        return "Tiempo Completo"
      case "partTime":
        return "Tiempo Parcial"
      case "intership":
        return "Prácticas"
      default:
        return type
    }
  }

  const getModalityLabel = (modality: string) => {
    console.log('Translating modality in colocaciones:', modality)
    switch (modality?.toLowerCase()) {
      case "onsite":
      case "on-site":
      case "presencial":
        return "Presencial"
      case "remote":
      case "remoto":
        return "Remoto"
      case "hybrid":
      case "hibrido":
      case "híbrido":
        return "Híbrido"
      case "":
      case null:
      case undefined:
        return ""
      default:
        return modality
    }
  }

  const getSectorLabel = (sector: string) => {
    console.log('Translating sector in colocaciones:', sector)
    switch (sector?.toLowerCase()) {
      case "technology":
      case "tech":
        return "Tecnología"
      case "healthcare":
      case "health":
        return "Salud"
      case "finance":
      case "financial":
        return "Finanzas"
      case "education":
        return "Educación"
      case "manufacturing":
        return "Manufactura"
      case "retail":
        return "Comercio"
      case "construction":
        return "Construcción"
      case "automotive":
        return "Automotriz"
      case "telecommunications":
      case "telecom":
        return "Telecomunicaciones"
      case "energy":
        return "Energía"
      case "agriculture":
        return "Agricultura"
      case "tourism":
        return "Turismo"
      case "logistics":
        return "Logística"
      case "consulting":
        return "Consultoría"
      case "marketing":
        return "Marketing"
      case "real estate":
        return "Bienes Raíces"
      case "food":
      case "food & beverage":
        return "Alimentos y Bebidas"
      case "entertainment":
        return "Entretenimiento"
      case "government":
        return "Gobierno"
      case "non-profit":
        return "Sin Fines de Lucro"
      case "":
      case null:
      case undefined:
        return ""
      default:
        return sector
    }
  }

  const getSizeLabel = (size: string) => {
    console.log('Translating size in colocaciones:', size)
    switch (size?.toLowerCase()) {
      case "startup":
        return "Startup"
      case "small":
        return "Pequeña"
      case "medium":
        return "Mediana"
      case "large":
        return "Grande"
      case "enterprise":
        return "Empresa"
      case "":
      case null:
      case undefined:
        return ""
      default:
        return size.charAt(0).toUpperCase() + size.slice(1).toLowerCase()
    }
  }

  const getPerformanceColor = (performance?: number) => {
    if (!performance) return "bg-gray-100 text-gray-800"
    if (performance >= 90) return "bg-green-100 text-green-800"
    if (performance >= 80) return "bg-blue-100 text-blue-800"
    if (performance >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const handleVerDetalles = (colocacion: Colocacion) => {
    setSelectedColocacion(colocacion)
  }

  const getPerformanceStars = (performance?: number) => {
    if (!performance) return 0
    return Math.round(performance / 20) // Convert 0-100 to 0-5 stars
  }

  const filteredColocaciones = colocaciones.filter(colocacion => {
    const matchesSearch = colocacion.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colocacion.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colocacion.vacante.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colocacion.student.career.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCareer = careerFilter === "all" || colocacion.student.career === careerFilter
    const matchesSector = sectorFilter === "all" || colocacion.company.sector === sectorFilter
    const matchesStatus = statusFilter === "all" || colocacion.status === statusFilter

    return matchesSearch && matchesCareer && matchesSector && matchesStatus
  })

  const careers = [...new Set(colocaciones.map(c => c.student.career))]
  const sectors = [...new Set(colocaciones.map(c => c.company.sector))]

  const exportToCSV = async () => {
    try {
      setIsExporting(true)

      // Prepare CSV data
      const csvData = filteredColocaciones.map(colocacion => ({
        'ID Colocación': colocacion.id,
        'Estudiante': colocacion.student.name,
        'Email Estudiante': colocacion.student.email,
        'Carrera': colocacion.student.career,
        'Semestre': colocacion.student.semester,
        'Empresa': colocacion.company.name,
        'Sector Empresa': getSectorLabel(colocacion.company.sector) || colocacion.company.sector,
        'Tamaño Empresa': getSizeLabel(colocacion.company.size) || colocacion.company.size,
        'Título del Puesto': colocacion.vacante.title,
        'Tipo de Empleo': getTypeLabel(colocacion.vacante.type),
        'Modalidad': getModalityLabel(colocacion.vacante.modality),
        'Ubicación': colocacion.vacante.location,
        'Salario': formatSalary(colocacion.vacante.salaryMin, colocacion.vacante.salaryMax),
        'Fecha de Contratación': formatDate(colocacion.hiredDate),
        'Fecha de Inicio': colocacion.startDate ? formatDate(colocacion.startDate) : 'No especificada',
        'Estado': getStatusLabel(colocacion.status),
        'Rendimiento (%)': colocacion.performance || 'No evaluado',
        'Notas': colocacion.notes || 'Sin notas'
      }))

      // Convert to CSV format
      const headers = Object.keys(csvData[0])
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          headers.map(header => {
            const value = row[header as keyof typeof row]
            // Escape commas and quotes in CSV
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value
          }).join(',')
        )
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `colocaciones_exitosas_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      console.log(`Exportadas ${filteredColocaciones.length} colocaciones a CSV`)

    } catch (error) {
      console.error('Error exporting CSV:', error)
    } finally {
      setIsExporting(false)
    }
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
            <Button onClick={fetchColocaciones}>Reintentar</Button>
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
            <TrendingUp className="h-6 w-6 md:h-8 w-8 text-orange-600" />
            Colocaciones Exitosas
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Estudiantes contratados exitosamente ({filteredColocaciones.length} colocaciones)
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{colocaciones.length}</p>
                <p className="text-xs text-muted-foreground">Total Colocaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{colocaciones.filter(c => c.status === "active").length}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {colocaciones.filter(c => c.performance && c.performance >= 80).length}
                </p>
                <p className="text-xs text-muted-foreground">Alto Rendimiento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{new Set(colocaciones.map(c => c.company.id)).size}</p>
                <p className="text-xs text-muted-foreground">Empresas Participantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por estudiante, empresa o puesto..."
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={careerFilter} onValueChange={setCareerFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Carrera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las carreras</SelectItem>
                  {careers.map((career) => (
                    <SelectItem key={career} value={career}>
                      {career}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sectores</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="terminated">Terminados</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={exportToCSV}
                disabled={isExporting || filteredColocaciones.length === 0}
                className="flex items-center gap-2 h-12"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isExporting ? "Exportando..." : "Exportar CSV"}
                </span>
              </Button>
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
          </div>
        </CardContent>
      </Card>

      {/* Colocaciones Display */}
      {filteredColocaciones.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron colocaciones</h3>
            <p className="text-muted-foreground">
              {searchTerm || careerFilter !== "all" || sectorFilter !== "all" || statusFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay colocaciones exitosas registradas"}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        // Cards View
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredColocaciones.map((colocacion) => (
            <Card key={colocacion.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={colocacion.student.image || "/placeholder.svg"} />
                      <AvatarFallback>
                        {colocacion.student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{colocacion.student.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {colocacion.student.career} • Semestre {colocacion.student.semester}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(colocacion.status)}>
                      {getStatusLabel(colocacion.status)}
                    </Badge>
                    {colocacion.performance && (
                      <Badge className={getPerformanceColor(colocacion.performance)}>
                        {colocacion.performance}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{colocacion.company.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {getSectorLabel(colocacion.company.sector)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{colocacion.vacante.title}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{colocacion.vacante.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{formatSalary(colocacion.vacante.salaryMin, colocacion.vacante.salaryMax)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Contratado: {formatDate(colocacion.hiredDate)}</span>
                  </div>
                  {colocacion.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Inicio: {formatDate(colocacion.startDate)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getTypeLabel(colocacion.vacante.type)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getModalityLabel(colocacion.vacante.modality)}
                  </Badge>
                </div>

                {colocacion.notes && (
                  <div className="p-2 bg-blue-50 rounded text-sm text-blue-800">
                    <p className="line-clamp-2">{colocacion.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleVerDetalles(colocacion)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl! max-h-[90vh]! overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">Detalles de Colocación Exitosa</DialogTitle>
                        <DialogDescription>
                          Información completa del estudiante, empresa y vacante
                        </DialogDescription>
                      </DialogHeader>

                      {selectedColocacion && (
                        <div className="space-y-6">
                          {/* Student Information */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                Información del Estudiante
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={selectedColocacion.student.image || "/placeholder.svg"} />
                                  <AvatarFallback className="text-lg">
                                    {selectedColocacion.student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{selectedColocacion.student.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    {selectedColocacion.student.email}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedColocacion.student.career}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Semestre {selectedColocacion.student.semester}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Company Information */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-purple-600" />
                                Información de la Empresa
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-lg">{selectedColocacion.company.name}</h3>
                                <Badge variant="outline" className="mt-1">
                                  {getSectorLabel(selectedColocacion.company.sector)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Sector: {getSectorLabel(selectedColocacion.company.sector)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Tamaño: {getSizeLabel(selectedColocacion.company.size)}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Job Information */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-green-600" />
                                Información de la Vacante
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-lg">{selectedColocacion.vacante.title}</h3>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {getTypeLabel(selectedColocacion.vacante.type)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {getModalityLabel(selectedColocacion.vacante.modality)}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedColocacion.vacante.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{formatSalary(selectedColocacion.vacante.salaryMin, selectedColocacion.vacante.salaryMax)}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Employment Details */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="h-5 w-5 text-orange-600" />
                                Detalles de la Colocación
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                  <Badge className={getStatusColor(selectedColocacion.status)}>
                                    {getStatusLabel(selectedColocacion.status)}
                                  </Badge>
                                  <p className="text-sm text-muted-foreground">Estado Actual</p>
                                </div>

                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                  <div className="flex items-center gap-2 justify-center mb-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold text-blue-600">
                                      {formatDate(selectedColocacion.hiredDate)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Fecha de Contratación</p>
                                </div>

                                {selectedColocacion.startDate && (
                                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="flex items-center gap-2 justify-center mb-2">
                                      <Clock className="h-4 w-4 text-purple-600" />
                                      <span className="font-semibold text-purple-600">
                                        {formatDate(selectedColocacion.startDate)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                                  </div>
                                )}

                                {selectedColocacion.performance && (
                                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${i < getPerformanceStars(selectedColocacion.performance)
                                            ? "text-yellow-500 fill-current"
                                            : "text-gray-300"
                                            }`}
                                        />
                                      ))}
                                      <span className="ml-2 font-semibold text-yellow-600">
                                        {selectedColocacion.performance}%
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Rendimiento</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Notes */}
                          {selectedColocacion.notes && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-gray-600" />
                                  Notas Adicionales
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {selectedColocacion.notes}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
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
                    <TableHead className="w-[200px]">Estudiante</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Salario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead className="text-center">Rendimiento</TableHead>
                    <TableHead>Fecha Contratación</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColocaciones.map((colocacion) => (
                    <TableRow key={colocacion.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={colocacion.student.image || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {colocacion.student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{colocacion.student.name}</p>
                            <p className="text-xs text-muted-foreground">{colocacion.student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{colocacion.student.career}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{colocacion.company.name}</p>
                          <p className="text-xs text-muted-foreground">{getSectorLabel(colocacion.company.sector)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{colocacion.vacante.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{colocacion.vacante.location}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatSalary(colocacion.vacante.salaryMin, colocacion.vacante.salaryMax)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(colocacion.status)}>
                          {getStatusLabel(colocacion.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(colocacion.vacante.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getModalityLabel(colocacion.vacante.modality)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {colocacion.performance ? (
                          <Badge className={getPerformanceColor(colocacion.performance)}>
                            {colocacion.performance}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(colocacion.hiredDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {colocacion.startDate ? (
                          <span className="text-sm text-muted-foreground">
                            {formatDate(colocacion.startDate)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pendiente</span>
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