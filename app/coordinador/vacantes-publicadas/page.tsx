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
} from "lucide-react"

interface Vacante {
  id: string
  title: string
  company: {
    name: string
    sector: string
  }
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
    switch (modality) {
      case "onSite":
        return "Presencial"
      case "remote":
        return "Remoto"
      case "hybrid":
        return "Híbrido"
      default:
        return modality
    }
  }

  const filteredVacantes = vacantes.filter(vacante => {
    const matchesSearch = vacante.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacante.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacante.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vacante.career && vacante.career.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || vacante.status === statusFilter
    const matchesType = typeFilter === "all" || vacante.type === typeFilter
    const matchesModality = modalityFilter === "all" || vacante.modality === modalityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesModality
  })

  const types = [...new Set(vacantes.map(vacante => vacante.type))]
  const modalities = [...new Set(vacantes.map(vacante => vacante.modality))]

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
            <Briefcase className="h-6 w-6 md:h-8 w-8 text-purple-600" />
            Vacantes Publicadas
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Lista completa de vacantes en la plataforma ({filteredVacantes.length} vacantes)
          </p>
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
                      {vacante.company.name}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(vacante.status)}>
                    {getStatusLabel(vacante.status)}
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

                {vacante.status === "expired" && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-700 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>Esta vacante ha expirado</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
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
                          <p className="font-medium">{vacante.company.name}</p>
                          <p className="text-xs text-muted-foreground">{vacante.company.sector}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{vacante.location}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatSalary(vacante.salaryMin, vacante.salaryMax)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vacante.status)}>
                          {getStatusLabel(vacante.status)}
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
                            {vacante.status === "expired" && (
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