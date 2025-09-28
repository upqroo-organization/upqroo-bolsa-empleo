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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Building2,
  Search,
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Users,
  Briefcase,
  Eye,
  Filter,
  Globe,
  FileText,
  Grid3X3,
  List,
} from "lucide-react"

interface Company {
  id: string
  name: string
  email: string
  sector: string
  size: string
  location: string
  phone?: string
  website?: string
  description?: string
  approvedDate: string
  status: string
  vacantesCount: number
  applicationsCount: number
  hiresCount: number
  fiscalDocumentUrl?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
}

export default function EmpresasValidadas() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/coordinador/empresas-validadas")

      if (!response.ok) {
        throw new Error("Error al cargar las empresas")
      }

      const result = await response.json()
      if (result.success) {
        setCompanies(result.data)
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

  const getSizeColor = (size: string) => {
    switch (size) {
      case "startup":
        return "bg-purple-100 text-purple-800"
      case "small":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-green-100 text-green-800"
      case "large":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSizeLabel = (size: string) => {
    switch (size) {
      case "startup":
        return "Startup"
      case "small":
        return "Pequeña"
      case "medium":
        return "Mediana"
      case "large":
        return "Grande"
      default:
        return size
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSector = sectorFilter === "all" || company.sector === sectorFilter
    const matchesSize = sizeFilter === "all" || company.size === sizeFilter

    return matchesSearch && matchesSector && matchesSize
  })

  const sectors = [...new Set(companies.map(company => company.sector))]
  const sizes = [...new Set(companies.map(company => company.size))]

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCompany(null)
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
            <Button onClick={fetchCompanies}>Reintentar</Button>
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
            <Building2 className="h-6 w-6 md:h-8 w-8 text-green-600" />
            Empresas Validadas
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Lista completa de empresas aprobadas en la plataforma ({filteredCompanies.length} empresas)
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{companies.length}</p>
                <p className="text-xs text-muted-foreground">Total Empresas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{companies.reduce((sum, c) => sum + c.vacantesCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Vacantes Publicadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{companies.reduce((sum, c) => sum + c.applicationsCount, 0)}</p>
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
                <p className="text-2xl font-bold">{companies.reduce((sum, c) => sum + c.hiresCount, 0)}</p>
                <p className="text-xs text-muted-foreground">Contrataciones</p>
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
                placeholder="Buscar por nombre, sector o ubicación..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por sector" />
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
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Filtrar por tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tamaños</SelectItem>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {getSizeLabel(size)}
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
        </CardContent>
      </Card>

      {/* Companies Display */}
      {filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron empresas</h3>
            <p className="text-muted-foreground">
              {searchTerm || sectorFilter !== "all" || sizeFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay empresas validadas en el sistema"}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        // Cards View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg`} />
                      <AvatarFallback>
                        {company.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {company.sector}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getSizeColor(company.size)}>
                      {getSizeLabel(company.size)}
                    </Badge>
                    {company.fiscalDocumentUrl && (
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Fiscal
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{company.email}</span>
                  </div>
                  {company.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{company.location}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{company.website}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Aprobada: {formatDate(company.approvedDate)}</span>
                  </div>
                </div>

                {company.description && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {company.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="font-semibold text-purple-600">{company.vacantesCount}</p>
                    <p className="text-muted-foreground">Vacantes</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="font-semibold text-blue-600">{company.applicationsCount}</p>
                    <p className="text-muted-foreground">Postulaciones</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-semibold text-green-600">{company.hiresCount}</p>
                    <p className="text-muted-foreground">Contratados</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(company)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
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
                    <TableHead className="w-[250px]">Empresa</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-center">Vacantes</TableHead>
                    <TableHead className="text-center">Postulaciones</TableHead>
                    <TableHead className="text-center">Contratados</TableHead>
                    <TableHead>Fecha Aprobación</TableHead>
                    <TableHead className="text-center">Fiscal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg`} />
                            <AvatarFallback className="text-xs">
                              {company.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{company.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{company.sector}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSizeColor(company.size)}>
                          {getSizeLabel(company.size)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{company.email}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{company.location}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-purple-600">
                          {company.vacantesCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-blue-600">
                          {company.applicationsCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold text-green-600">
                          {company.hiresCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(company.approvedDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {company.fiscalDocumentUrl ? (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Sí
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No</span>
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

      {/* Company Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-6xl! max-h-[95vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/placeholder.svg`} />
                <AvatarFallback>
                  {selectedCompany?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{selectedCompany?.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedCompany?.sector}</p>
              </div>
            </DialogTitle>
            <DialogDescription>
              Información completa de la empresa validada
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Tamaño de Empresa</span>
                          <div className="mt-1">
                            <Badge className={getSizeColor(selectedCompany.size)}>
                              {getSizeLabel(selectedCompany.size)}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Estado</span>
                          <div className="mt-1">
                            <Badge className="bg-green-100 text-green-800">
                              Validada
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Fecha de Aprobación</span>
                          <p className="text-sm mt-1">
                            {formatDate(selectedCompany.approvedDate)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Constancia Fiscal</span>
                          <div className="mt-1">
                            {selectedCompany.fiscalDocumentUrl ? (
                              <Badge variant="outline" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                Disponible
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">No disponible</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Estadísticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{selectedCompany.vacantesCount}</p>
                        <p className="text-xs text-muted-foreground">Vacantes Publicadas</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedCompany.applicationsCount}</p>
                        <p className="text-xs text-muted-foreground">Postulaciones</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedCompany.hiresCount}</p>
                        <p className="text-xs text-muted-foreground">Contrataciones</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">EMPRESA</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCompany.email}</span>
                        </div>
                        {selectedCompany.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedCompany.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCompany.location}</span>
                        </div>
                        {selectedCompany.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={selectedCompany.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {selectedCompany.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {(selectedCompany.contactName || selectedCompany.contactEmail || selectedCompany.contactPhone) && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm text-muted-foreground">CONTACTO PRINCIPAL</h4>
                        <div className="space-y-3">
                          {selectedCompany.contactName && (
                            <div className="flex items-center gap-3">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedCompany.contactName}</span>
                            </div>
                          )}
                          {selectedCompany.contactEmail && (
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedCompany.contactEmail}</span>
                            </div>
                          )}
                          {selectedCompany.contactPhone && (
                            <div className="flex items-center gap-3">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedCompany.contactPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Company Description */}
              {selectedCompany.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Descripción de la Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedCompany.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {selectedCompany.fiscalDocumentUrl && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const filename = selectedCompany.fiscalDocumentUrl?.split('/').pop()
                      if (filename) {
                        window.open(`/api/uploads/fiscal-documents/${filename}`, '_blank')
                      }
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Constancia Fiscal
                  </Button>
                )}
                <Button variant="outline" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}