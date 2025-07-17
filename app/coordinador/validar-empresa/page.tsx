"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
} from "lucide-react"

type Company = {
  id: string
  name: string
  email: string
  industry: string | null
  address: string | null
  description: string | null
  contactName: string | null
  contactPosition: string | null
  contactEmail: string | null
  contactPhone: string | null
  phone: string | null
  rfc: string | null
  isApprove: boolean
  createdAt: string
  updatedAt: string
  state: {
    id: number
    name: string
  } | null
  vacantes: {
    id: string
    title: string
    createdAt: string
  }[]
}

type Statistics = {
  pending: number
  approved: number
  total: number
}

export default function ValidateCompanies() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [validationDialog, setValidationDialog] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [statistics, setStatistics] = useState<Statistics>({ pending: 0, approved: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [comments, setComments] = useState("")

  // Fetch companies data
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: activeTab === 'all' ? 'all' : activeTab,
        ...(searchTerm && { search: searchTerm }),
        ...(sectorFilter !== 'all' && { sector: sectorFilter })
      })

      const response = await fetch(`/api/coordinador/companies?${params}`)
      const data = await response.json()

      if (data.success) {
        setCompanies(data.data.companies)
        setStatistics(data.data.statistics)
      } else {
        console.error('Error fetching companies:', data.error)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchTerm, sectorFilter])

  // Load companies on component mount and when filters change
  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  // Filter companies based on current tab
  const getFilteredCompanies = () => {
    switch (activeTab) {
      case 'pending':
        return companies.filter(c => !c.isApprove)
      case 'approved':
        return companies.filter(c => c.isApprove)
      case 'all':
      default:
        return companies
    }
  }

  const filteredCompanies = getFilteredCompanies()

  const handleValidation = async (companyId: string | undefined, action: string) => {
    if (!companyId) return

    try {
      setValidating(true)
      const response = await fetch(`/api/coordinador/companies/${companyId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          comments: comments.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        // Refresh companies list
        await fetchCompanies()
        setValidationDialog(false)
        setComments('')
        toast.success(data.message, {
          description: action === 'approve' ? 'La empresa ha sido aprobada exitosamente' : 'La empresa ha sido rechazada',
          duration: 5000
        })
      } else {
        toast.error(data.error || 'Error al procesar la solicitud', {
          description: 'No se pudo completar la acción. Intente nuevamente.',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Error validating company:', error)
      toast.error('Error de conexión', {
        description: 'No se pudo conectar con el servidor. Verifique su conexión a internet.',
        duration: 5000
      })
    } finally {
      setValidating(false)
    }
  }

  const stats = [
    { 
      title: "Pendientes", 
      value: statistics.pending.toString(), 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100" 
    },
    { 
      title: "Aprobadas", 
      value: statistics.approved.toString(), 
      color: "text-green-600", 
      bgColor: "bg-green-100" 
    },
    { 
      title: "Total", 
      value: statistics.total.toString(), 
      color: "text-blue-600", 
      bgColor: "bg-blue-100" 
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Validar Empresas</h1>
          <p className="text-muted-foreground">Gestión y validación de empresas registradas en la plataforma</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Building2 className={`h-4 w-4 ${stat.color}`} />
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

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empresas por nombre o sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sectores</SelectItem>
            <SelectItem value="tech">Tecnología</SelectItem>
            <SelectItem value="tourism">Turismo</SelectItem>
            <SelectItem value="manufacturing">Manufactura</SelectItem>
            <SelectItem value="services">Servicios</SelectItem>
            <SelectItem value="retail">Comercio</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pendientes ({statistics.pending})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Aprobadas ({statistics.approved})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todas ({statistics.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Cargando empresas...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay empresas pendientes de aprobación</p>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <Card key={company.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {company.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          <Badge variant="secondary">
                            Pendiente
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {company.industry || 'No especificado'}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {company.email}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {company.state?.name || 'No especificado'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(company.createdAt).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <p className="text-sm mt-2">{company.description || 'Sin descripción'}</p>

                        {/* Company Info */}
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {company.rfc && (
                              <Badge variant="outline">
                                RFC: {company.rfc}
                              </Badge>
                            )}
                            {company.phone && (
                              <Badge variant="outline">
                                Tel: {company.phone}
                              </Badge>
                            )}
                            {company.contactName && (
                              <Badge variant="outline">
                                Contacto: {company.contactName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{company.name}</DialogTitle>
                            <DialogDescription>Información completa de la empresa</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Contacto Principal</Label>
                                <div className="mt-1 space-y-1">
                                  <p className="font-medium">{company.contactName || 'No especificado'}</p>
                                  <p className="text-sm text-muted-foreground">{company.contactPosition || 'No especificado'}</p>
                                  <div className="flex items-center text-sm">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {company.contactEmail || company.email}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {company.contactPhone || company.phone || 'No especificado'}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label>Información Empresarial</Label>
                                <div className="mt-1 space-y-1">
                                  <p className="text-sm">RFC: {company.rfc || 'No especificado'}</p>
                                  <p className="text-sm">Sector: {company.industry || 'No especificado'}</p>
                                  <p className="text-sm">Estado: {company.state?.name || 'No especificado'}</p>
                                  <p className="text-sm">Registrada: {new Date(company.createdAt).toLocaleDateString('es-ES')}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Descripción</Label>
                              <p className="text-sm mt-1">{company.description || 'Sin descripción proporcionada'}</p>
                            </div>
                            {company.address && (
                              <div>
                                <Label>Dirección</Label>
                                <p className="text-sm mt-1">{company.address}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={validationDialog} onOpenChange={setValidationDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedCompany(company)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Validar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Validar Empresa</DialogTitle>
                            <DialogDescription>
                              Aprobar o rechazar la solicitud de {selectedCompany?.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="comments">Comentarios</Label>
                              <Textarea
                                id="comments"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Agregar comentarios sobre la validación..."
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => handleValidation(selectedCompany?.id, "reject")}
                              disabled={validating}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rechazar
                            </Button>
                            <Button 
                              onClick={() => handleValidation(selectedCompany?.id, "approve")}
                              disabled={validating}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Aprobar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Cargando empresas...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay empresas aprobadas</p>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <Card key={company.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {company.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Aprobada
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{company.industry || 'No especificado'}</span>
                          <span>{company.state?.name || 'No especificado'}</span>
                          <span>Aprobada: {new Date(company.updatedAt).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm mt-1">
                          <span className="text-blue-600">{company.vacantes.length} vacantes publicadas</span>
                          <span className="text-green-600">Activa desde {new Date(company.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Cargando empresas...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay empresas registradas</p>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <Card key={company.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {company.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{company.name}</h3>
                          <Badge variant={company.isApprove ? "default" : "secondary"} 
                                 className={company.isApprove ? "bg-green-100 text-green-800" : ""}>
                            {company.isApprove ? "Aprobada" : "Pendiente"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {company.industry || 'No especificado'}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {company.email}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {company.state?.name || 'No especificado'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(company.createdAt).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <p className="text-sm mt-2">{company.description || 'Sin descripción'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      {!company.isApprove && (
                        <Button size="sm" onClick={() => {
                          setSelectedCompany(company)
                          setValidationDialog(true)
                        }}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Validar
                        </Button>
                      )}
                    </div>
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
