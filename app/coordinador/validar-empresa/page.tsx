"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Clock,
  MapPin,
  Users,
  Phone,
  Mail,
  Globe,
  Calendar,
  Download,
  AlertTriangle,
} from "lucide-react"

type Company = {
  id: number
  name: string
  sector: string
  size: string
  location: string
  submittedDate: string
  status: string
  contact: {
    name: string
    position: string
    email: string
    phone: string
  }
  documents: { name: string; status: string }[]
  description: string
  website: string
  employees: number
  founded: string
}

export default function ValidateCompanies() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [validationDialog, setValidationDialog] = useState(false)

  const stats = [
    { title: "Pendientes", value: "12", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { title: "Aprobadas", value: "89", color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Rechazadas", value: "7", color: "text-red-600", bgColor: "bg-red-100" },
    { title: "Total", value: "108", color: "text-blue-600", bgColor: "bg-blue-100" },
  ]

  const companies = [
    {
      id: 1,
      name: "TechCorp S.A.",
      sector: "Tecnología",
      size: "50-100 empleados",
      location: "Chetumal, Q.Roo",
      submittedDate: "2024-01-15",
      status: "pending",
      contact: {
        name: "Ana García",
        position: "Directora de RH",
        email: "ana.garcia@techcorp.com",
        phone: "+52 983 123 4567",
      },
      documents: [
        { name: "Acta Constitutiva", status: "complete" },
        { name: "RFC", status: "complete" },
        { name: "Comprobante Domicilio", status: "complete" },
        { name: "Referencias Comerciales", status: "pending" },
      ],
      description: "Empresa de desarrollo de software especializada en soluciones empresariales.",
      website: "www.techcorp.com.mx",
      employees: 75,
      founded: "2018",
    },
    {
      id: 2,
      name: "Green Solutions",
      sector: "Sustentabilidad",
      size: "10-50 empleados",
      location: "Cancún, Q.Roo",
      submittedDate: "2024-01-14",
      status: "review",
      contact: {
        name: "Carlos Mendoza",
        position: "Gerente General",
        email: "carlos@greensolutions.mx",
        phone: "+52 998 987 6543",
      },
      documents: [
        { name: "Acta Constitutiva", status: "complete" },
        { name: "RFC", status: "complete" },
        { name: "Comprobante Domicilio", status: "complete" },
      ],
      description: "Consultoría en sustentabilidad y energías renovables.",
      website: "www.greensolutions.mx",
      employees: 25,
      founded: "2020",
    },
    {
      id: 3,
      name: "Maya Tourism",
      sector: "Turismo",
      size: "100+ empleados",
      location: "Playa del Carmen, Q.Roo",
      submittedDate: "2024-01-13",
      status: "pending",
      contact: {
        name: "Sofia Herrera",
        position: "Coordinadora de RH",
        email: "sofia.herrera@mayatourism.com",
        phone: "+52 984 876 5432",
      },
      documents: [
        { name: "Acta Constitutiva", status: "complete" },
        { name: "RFC", status: "complete" },
        { name: "Comprobante Domicilio", status: "complete" },
        { name: "Referencias Comerciales", status: "complete" },
        { name: "Licencias Turísticas", status: "complete" },
      ],
      description: "Operadora turística especializada en experiencias culturales mayas.",
      website: "www.mayatourism.com",
      employees: 150,
      founded: "2015",
    },
  ]

  const approvedCompanies = [
    {
      id: 4,
      name: "DevSoft Solutions",
      sector: "Tecnología",
      size: "20-50 empleados",
      location: "Chetumal, Q.Roo",
      approvedDate: "2024-01-10",
      status: "approved",
      activeJobs: 5,
      totalHires: 12,
    },
    {
      id: 5,
      name: "Eco Riviera",
      sector: "Turismo Sustentable",
      size: "50-100 empleados",
      location: "Tulum, Q.Roo",
      approvedDate: "2024-01-08",
      status: "approved",
      activeJobs: 3,
      totalHires: 8,
    },
  ]

  const rejectedCompanies = [
    {
      id: 6,
      name: "Fake Corp",
      sector: "Indefinido",
      size: "1-10 empleados",
      location: "No especificado",
      rejectedDate: "2024-01-12",
      status: "rejected",
      reason: "Documentación incompleta y datos inconsistentes",
    },
  ]

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleValidation = (companyId: number | undefined, action: string, comments: string = "") => {
    console.log(`${action} company ${companyId} with comments: ${comments}`)
    setValidationDialog(false)
  }

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
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sectores</SelectItem>
            <SelectItem value="tech">Tecnología</SelectItem>
            <SelectItem value="tourism">Turismo</SelectItem>
            <SelectItem value="sustainability">Sustentabilidad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pendientes ({companies.filter((c) => c.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">Aprobadas ({approvedCompanies.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas ({rejectedCompanies.length})</TabsTrigger>
          <TabsTrigger value="all">
            Todas ({companies.length + approvedCompanies.length + rejectedCompanies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredCompanies
            .filter((c) => c.status === "pending" || c.status === "review")
            .map((company) => (
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
                          <Badge variant={company.status === "pending" ? "secondary" : "outline"}>
                            {company.status === "pending" ? "Pendiente" : "En Revisión"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {company.sector}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {company.size}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {company.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {company.submittedDate}
                          </div>
                        </div>
                        <p className="text-sm mt-2">{company.description}</p>

                        {/* Documents Status */}
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Documentos:</p>
                          <div className="flex flex-wrap gap-2">
                            {company.documents.map((doc, index) => (
                              <Badge key={index} variant={doc.status === "complete" ? "default" : "secondary"}>
                                {doc.name}
                                {doc.status === "complete" ? (
                                  <CheckCircle className="h-3 w-3 ml-1" />
                                ) : (
                                  <Clock className="h-3 w-3 ml-1" />
                                )}
                              </Badge>
                            ))}
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
                                  <p className="font-medium">{company.contact.name}</p>
                                  <p className="text-sm text-muted-foreground">{company.contact.position}</p>
                                  <div className="flex items-center text-sm">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {company.contact.email}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {company.contact.phone}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label>Información Empresarial</Label>
                                <div className="mt-1 space-y-1">
                                  <div className="flex items-center text-sm">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {company.website}
                                  </div>
                                  <p className="text-sm">Empleados: {company.employees}</p>
                                  <p className="text-sm">Fundada: {company.founded}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Descripción</Label>
                              <p className="text-sm mt-1">{company.description}</p>
                            </div>
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
                                placeholder="Agregar comentarios sobre la validación..."
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => handleValidation(selectedCompany?.id, "reject")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Rechazar
                            </Button>
                            <Button onClick={() => handleValidation(selectedCompany?.id, "approve")}>
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
            ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedCompanies.map((company) => (
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
                        <span>{company.sector}</span>
                        <span>{company.location}</span>
                        <span>Aprobada: {company.approvedDate}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm mt-1">
                        <span className="text-blue-600">{company.activeJobs} vacantes activas</span>
                        <span className="text-green-600">{company.totalHires} contrataciones</span>
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
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedCompanies.map((company) => (
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
                        <Badge variant="destructive">Rechazada</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{company.sector}</span>
                        <span>{company.location}</span>
                        <span>Rechazada: {company.rejectedDate}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                          <p className="text-sm text-red-600">{company.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <p className="text-muted-foreground">Mostrando todas las empresas del sistema...</p>
          {/* Aquí se mostrarían todas las empresas combinadas */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
