"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Briefcase,
  Search,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Building2,
  Eye,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Grid3X3,
  List,
  FileText,
  Phone,
  Mail,
  GraduationCap,
  Download,
} from "lucide-react"

interface Vacante {
  id: string
  title: string
  description?: string
  requirements?: string
  benefits?: string
  company?: {
    name: string
    sector: string
  } | null
  type: string
  modality: string
  location: string
  salaryMin?: number
  salaryMax?: number
  status: string
  createdDate: string
  deadline?: string
  applicationsCount: number
  interviewsCount: number
  hiresCount: number
  career?: string
  department?: string
  numberOfPositions?: number
  state?: string
  isExternal?: boolean
  externalCompanyName?: string
  externalCompanyEmail?: string
  externalCompanyPhone?: string
}

interface Postulante {
  id: string
  user: {
    name: string
    email: string
    phone?: string
  }
  status: string
  appliedDate: string
  cvUrl?: string
  career?: string
  semester?: string
  gpa?: number
}

export default function VacantesPublicadas() {
  const router = useRouter()
  const [vacantes, setVacantes] = useState<Vacante[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [modalityFilter, setModalityFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  // Modal states
  const [selectedVacante, setSelectedVacante] = useState<Vacante | null>(null)
  const [postulantes, setPostulantes] = useState<Postulante[]>([])
  const [loadingPostulantes, setLoadingPostulantes] = useState(false)
  const [showPostulantes, setShowPostulantes] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchVacantes()
  }, [])

  const fetchVacantes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/coordinador/vacantes-publicadas")

      if (!response.ok) {
        throw new Error("Error al cargar las vacantes")
      }

      const result = await response.json()
      if (result.success) {
        setVacantes(result.data)
      } else {
        setError(result.error || "Error desconocido")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const fetchPostulantes = async (vacanteId: string) => {
    try {
      setLoadingPostulantes(true)
      const response = await fetch(`/api/coordinador/vacantes/${vacanteId}/postulantes`)

      if (!response.ok) {
        throw new Error("Error al cargar los postulantes")
      }

      const result = await response.json()
      if (result.success) {
        setPostulantes(result.data)
      } else {
        setPostulantes([])
      }
    } catch (err) {
      console.error("Error fetching postulantes:", err)
      setPostulantes([])
    } finally {
      setLoadingPostulantes(false)
    }
  }

  const handleVerDetalles = (vacante: Vacante) => {
    setSelectedVacante(vacante)
  }

  const handleVerPostulantes = (vacante: Vacante) => {
    setSelectedVacante(vacante)
    fetchPostulantes(vacante.id)
    setShowPostulantes(true)
  }

  const getPostulanteStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
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

  const getPostulanteStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "reviewed":
        return "Revisado"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
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
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa"
      case "paused":
        return "Pausada"
      case "expired":
        return "Expirada"
      case "closed":
        return "Cerrada"
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
    console.log('Translating modality:', modality)
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

  // Translation function for industry sectors
  const getSectorLabel = (sector: string | null) => {
    if (!sector) return 'No especificado'

    switch (sector.toLowerCase()) {
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
      case "services":
        return "Servicios"
      case "other":
        return "Otro"
      default:
        return sector
    }
  }

  const getRealStatus = (vacante: Vacante) => {
    if (vacante.deadline) {
      const now = new Date()
      const deadline = new Date(vacante.deadline)
      if (deadline < now && vacante.status === "active") {
        return "expired"
      }
    }
    return vacante.status
  }

  const filteredVacantes = vacantes.filter(vacante => {
    const companyName = vacante.company?.name || vacante.externalCompanyName || '';
    const matchesSearch = vacante.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacante.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vacante.career && vacante.career.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || vacante.status === statusFilter
    const matchesType = typeFilter === "all" || vacante.type === typeFilter
    const matchesModality = modalityFilter === "all" || vacante.modality === modalityFilter

    return matchesSearch && matchesStatus && matchesType && matchesModality
  })

  const types = [...new Set(vacantes.map(vacante => vacante.type))]
  const modalities = [...new Set(vacantes.map(vacante => vacante.modality))]

  const exportToCSV = async () => {
    try {
      setIsExporting(true)

      // Prepare CSV data
      const csvData = filteredVacantes.map(vacante => ({
        'ID': vacante.id,
        'Título': vacante.title,
        'Empresa': vacante.company?.name || vacante.externalCompanyName || 'Empresa Externa',
        'Sector': vacante.company?.sector ? getSectorLabel(vacante.company.sector) : 'N/A',
        'Tipo': getTypeLabel(vacante.type),
        'Modalidad': getModalityLabel(vacante.modality),
        'Ubicación': vacante.location,
        'Salario': formatSalary(vacante.salaryMin, vacante.salaryMax),
        'Estado': getStatusLabel(getRealStatus(vacante)),
        'Fecha de Publicación': formatDate(vacante.createdDate),
        'Fecha de Expiración': vacante.deadline ? formatDate(vacante.deadline) : 'No especificada',
        'Carrera': vacante.career || 'No especificada',
        'Departamento': vacante.department || 'No especificado',
        'Número de Posiciones': vacante.numberOfPositions || 'No especificado',
        'Estado/Región': vacante.state || 'No especificado',
        'Postulaciones': vacante.applicationsCount,
        'Entrevistas': vacante.interviewsCount,
        'Contrataciones': vacante.hiresCount,
        'Descripción': vacante.description ? vacante.description.replace(/\n/g, ' ').substring(0, 500) : 'No especificada',
        'Requisitos': vacante.requirements ? vacante.requirements.replace(/\n/g, ' ').substring(0, 500) : 'No especificados',
        'Beneficios': vacante.benefits ? vacante.benefits.replace(/\n/g, ' ').substring(0, 500) : 'No especificados'
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
      link.setAttribute('download', `vacantes_publicadas_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      console.log(`Exportadas ${filteredVacantes.length} vacantes a CSV`)

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
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
            <Button onClick={fetchVacantes}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              Vacantes Publicadas
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Lista completa de vacantes en la plataforma ({filteredVacantes.length} vacantes)
            </p>
          </div>
          <Button
            onClick={() => router.push('/coordinador/vacantes-publicadas/crear-externa')}
            className="w-full sm:w-auto"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Crear Vacante Externa
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{vacantes.length}</p>
                <p className="text-xs text-muted-foreground">Total Vacantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{vacantes.filter(v => v.status === "active").length}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{vacantes.reduce((sum, v) => sum + v.applicationsCount, 0)}</p>
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
                <p className="text-2xl font-bold">{vacantes.reduce((sum, v) => sum + v.hiresCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Contrataciones</p>
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
                  placeholder="Buscar por título, empresa o ubicación..."
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="paused">Pausadas</SelectItem>
                  <SelectItem value="expired">Expiradas</SelectItem>
                  <SelectItem value="closed">Cerradas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-full md:w-48 h-12">
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las modalidades</SelectItem>
                  {modalities.map((modality) => (
                    <SelectItem key={modality} value={modality}>
                      {getModalityLabel(modality)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={exportToCSV}
                disabled={isExporting || filteredVacantes.length === 0}
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

      {/* Vacantes Display */}
      {filteredVacantes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron vacantes</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || modalityFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay vacantes publicadas en el sistema"}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        // Cards View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVacantes.map((vacante) => (
            <Card key={vacante.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{vacante.title}</CardTitle>
                    <CardDescription className="text-sm flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3" />
                      {vacante.company?.name || vacante.externalCompanyName || 'Empresa Externa'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(getRealStatus(vacante))}>
                    {getStatusLabel(getRealStatus(vacante))}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vacante.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{formatSalary(vacante.salaryMin, vacante.salaryMax)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Publicada: {formatDate(vacante.createdDate)}</span>
                  </div>
                  {vacante.deadline && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Expira: {formatDate(vacante.deadline)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getTypeLabel(vacante.type)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getModalityLabel(vacante.modality)}
                  </Badge>
                  {vacante.career && (
                    <Badge variant="outline" className="text-xs">
                      {vacante.career}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="font-semibold text-blue-600">{vacante.applicationsCount}</p>
                    <p className="text-muted-foreground">Postulaciones</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="font-semibold text-purple-600">{vacante.interviewsCount}</p>
                    <p className="text-muted-foreground">Entrevistas</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-semibold text-green-600">{vacante.hiresCount}</p>
                    <p className="text-muted-foreground">Contratados</p>
                  </div>
                </div>

                {getRealStatus(vacante) === "expired" && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-700 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>Esta vacante ha expirado</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleVerDetalles(vacante)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{selectedVacante?.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {selectedVacante?.company?.name || selectedVacante?.externalCompanyName || 'Empresa Externa'}
                          {selectedVacante?.company?.sector && ` • ${getSectorLabel(selectedVacante.company.sector)}`}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedVacante && (
                        <div className="space-y-6">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{selectedVacante.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formatSalary(selectedVacante.salaryMin, selectedVacante.salaryMax)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Publicada: {formatDate(selectedVacante.createdDate)}</span>
                              </div>
                              {selectedVacante.deadline && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">Expira: {formatDate(selectedVacante.deadline)}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(getRealStatus(selectedVacante))}>
                                  {getStatusLabel(getRealStatus(selectedVacante))}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {getTypeLabel(selectedVacante.type)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {getModalityLabel(selectedVacante.modality)}
                                </Badge>
                              </div>
                              {selectedVacante.career && (
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedVacante.career}</span>
                                </div>
                              )}
                              {selectedVacante.numberOfPositions && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{selectedVacante.numberOfPositions} posiciones</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <p className="text-2xl font-bold text-blue-600">{selectedVacante.applicationsCount}</p>
                              <p className="text-sm text-muted-foreground">Postulaciones</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <p className="text-2xl font-bold text-purple-600">{selectedVacante.interviewsCount}</p>
                              <p className="text-sm text-muted-foreground">Entrevistas</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <p className="text-2xl font-bold text-green-600">{selectedVacante.hiresCount}</p>
                              <p className="text-sm text-muted-foreground">Contratados</p>
                            </div>
                          </div>

                          {/* Description */}
                          {selectedVacante.description && (
                            <div>
                              <h3 className="font-semibold mb-2">Descripción del Puesto</h3>
                              <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                {selectedVacante.description}
                              </div>
                            </div>
                          )}

                          {/* Requirements */}
                          {selectedVacante.requirements && (
                            <div>
                              <h3 className="font-semibold mb-2">Requisitos</h3>
                              <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                {selectedVacante.requirements}
                              </div>
                            </div>
                          )}

                          {/* Benefits */}
                          {selectedVacante.benefits && (
                            <div>
                              <h3 className="font-semibold mb-2">Beneficios</h3>
                              <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                {selectedVacante.benefits}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Sheet open={showPostulantes} onOpenChange={setShowPostulantes}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleVerPostulantes(vacante)}>
                        <Users className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-2xl">
                      <SheetHeader>
                        <SheetTitle>Postulantes - {selectedVacante?.title}</SheetTitle>
                        <SheetDescription>
                          Lista de candidatos que se han postulado a esta vacante
                        </SheetDescription>
                      </SheetHeader>

                      <div className="mt-6 space-y-4">
                        {loadingPostulantes ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="p-4 border rounded-lg">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-48 mb-2" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            ))}
                          </div>
                        ) : postulantes.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No hay postulantes</h3>
                            <p className="text-muted-foreground">
                              Aún no se han recibido postulaciones para esta vacante
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {postulantes.map((postulante) => (
                              <Card key={postulante.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{postulante.user.name}</h4>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <Mail className="h-3 w-3" />
                                        {postulante.user.email}
                                      </div>
                                      {postulante.user.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                          <Phone className="h-3 w-3" />
                                          {postulante.user.phone}
                                        </div>
                                      )}
                                    </div>
                                    <Badge className={getPostulanteStatusColor(postulante.status)}>
                                      {getPostulanteStatusLabel(postulante.status)}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {postulante.career && (
                                      <div className="flex items-center gap-2">
                                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                                        <span>{postulante.career}</span>
                                      </div>
                                    )}
                                    {postulante.semester && (
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-3 w-3 text-muted-foreground" />
                                        <span>Semestre {postulante.semester}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3 text-muted-foreground" />
                                      <span>Postulado: {formatDate(postulante.appliedDate)}</span>
                                    </div>
                                    {postulante.gpa && (
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3 text-muted-foreground" />
                                        <span>Promedio: {postulante.gpa}</span>
                                      </div>
                                    )}
                                  </div>

                                  {postulante.cvUrl && (
                                    <div className="mt-3 pt-3 border-t">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          // Extract filename from cvUrl and construct API URL
                                          const filename = postulante.cvUrl?.split('/').pop() || postulante.cvUrl
                                          const apiUrl = `/api/uploads/cvs/${filename}`
                                          window.open(apiUrl, '_blank')
                                        }}
                                      >
                                        <Eye className="h-3 w-3 mr-2" />
                                        Ver CV
                                      </Button>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
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
                    <TableHead className="w-[250px]">Vacante</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Salario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead className="text-center">Postulaciones</TableHead>
                    <TableHead className="text-center">Entrevistas</TableHead>
                    <TableHead className="text-center">Contratados</TableHead>
                    <TableHead>Fecha Publicación</TableHead>
                    <TableHead>Fecha Límite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVacantes.map((vacante) => (
                    <TableRow key={vacante.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-2">{vacante.title}</p>
                          {vacante.career && (
                            <p className="text-xs text-muted-foreground">{vacante.career}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vacante.company?.name || vacante.externalCompanyName || 'Empresa Externa'}</p>
                          <p className="text-xs text-muted-foreground">{vacante.company?.sector ? getSectorLabel(vacante.company.sector) : 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{vacante.location}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatSalary(vacante.salaryMin, vacante.salaryMax)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(getRealStatus(vacante))}>
                          {getStatusLabel(getRealStatus(vacante))}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(vacante.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getModalityLabel(vacante.modality)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-blue-600">
                          {vacante.applicationsCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-purple-600">
                          {vacante.interviewsCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-green-600">
                          {vacante.hiresCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(vacante.createdDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {vacante.deadline ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(vacante.deadline)}
                            </span>
                            {getRealStatus(vacante) === "expired" && (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin límite</span>
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