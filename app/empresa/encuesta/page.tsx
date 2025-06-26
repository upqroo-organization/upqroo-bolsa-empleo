"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Download,
  Send,
} from "lucide-react"

// Mock data para encuestas
const mockSurveys = [
  {
    id: 1,
    title: "Satisfacción Laboral 2024",
    description: "Evaluación del ambiente laboral y satisfacción de empleados",
    status: "active",
    responses: 45,
    totalSent: 120,
    createdAt: "2024-01-15",
    expiresAt: "2024-02-15",
    type: "satisfaction",
    questions: 12,
  },
  {
    id: 2,
    title: "Evaluación de Candidatos - Desarrollador",
    description: "Encuesta técnica para evaluar habilidades de programación",
    status: "draft",
    responses: 0,
    totalSent: 0,
    createdAt: "2024-01-20",
    expiresAt: "2024-03-01",
    type: "technical",
    questions: 8,
  },
  {
    id: 3,
    title: "Feedback Post-Entrevista",
    description: "Recopilación de comentarios después del proceso de entrevista",
    status: "completed",
    responses: 28,
    totalSent: 30,
    createdAt: "2023-12-01",
    expiresAt: "2024-01-01",
    type: "feedback",
    questions: 6,
  },
  {
    id: 4,
    title: "Cultura Organizacional",
    description: "Evaluación de la percepción de la cultura empresarial",
    status: "active",
    responses: 67,
    totalSent: 85,
    createdAt: "2024-01-10",
    expiresAt: "2024-02-28",
    type: "culture",
    questions: 15,
  },
]

const mockQuestions = [
  {
    id: 1,
    question: "¿Qué tan satisfecho estás con tu trabajo actual?",
    type: "scale",
    responses: [
      { option: "Muy satisfecho", count: 15, percentage: 33 },
      { option: "Satisfecho", count: 20, percentage: 44 },
      { option: "Neutral", count: 8, percentage: 18 },
      { option: "Insatisfecho", count: 2, percentage: 4 },
      { option: "Muy insatisfecho", count: 0, percentage: 0 },
    ],
  },
  {
    id: 2,
    question: "¿Recomendarías nuestra empresa como lugar de trabajo?",
    type: "yesno",
    responses: [
      { option: "Sí", count: 38, percentage: 84 },
      { option: "No", count: 7, percentage: 16 },
    ],
  },
]

export default function Surveys() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activa</Badge>
      case "draft":
        return <Badge variant="secondary">Borrador</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completada</Badge>
      case "expired":
        return <Badge variant="destructive">Expirada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "satisfaction":
        return <TrendingUp className="h-4 w-4" />
      case "technical":
        return <BarChart3 className="h-4 w-4" />
      case "feedback":
        return <Users className="h-4 w-4" />
      case "culture":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredSurveys = mockSurveys.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || survey.status === activeTab
    return matchesSearch && matchesTab
  })

  const surveyStats = {
    total: mockSurveys.length,
    active: mockSurveys.filter((s) => s.status === "active").length,
    draft: mockSurveys.filter((s) => s.status === "draft").length,
    completed: mockSurveys.filter((s) => s.status === "completed").length,
    totalResponses: mockSurveys.reduce((acc, s) => acc + s.responses, 0),
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Encuestas</h1>
          <p className="text-muted-foreground">Gestiona y analiza encuestas para candidatos y empleados</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Encuesta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Encuesta</DialogTitle>
              <DialogDescription>Completa la información básica para crear una nueva encuesta</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Encuesta</Label>
                  <Input id="title" placeholder="Ej: Satisfacción Laboral 2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Encuesta</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="satisfaction">Satisfacción</SelectItem>
                      <SelectItem value="technical">Técnica</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="culture">Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Describe el propósito de esta encuesta..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expires">Fecha de Expiración</Label>
                  <Input id="expires" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Dirigida a</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar audiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidates">Candidatos</SelectItem>
                      <SelectItem value="employees">Empleados</SelectItem>
                      <SelectItem value="both">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-primary hover:bg-primary/90">Crear Encuesta</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Encuestas</p>
                <p className="text-2xl font-bold">{surveyStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Activas</p>
                <p className="text-2xl font-bold text-green-600">{surveyStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Borradores</p>
                <p className="text-2xl font-bold text-yellow-600">{surveyStats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Completadas</p>
                <p className="text-2xl font-bold text-blue-600">{surveyStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Respuestas</p>
                <p className="text-2xl font-bold">{surveyStats.totalResponses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar encuestas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas ({surveyStats.total})</TabsTrigger>
          <TabsTrigger value="active">Activas ({surveyStats.active})</TabsTrigger>
          <TabsTrigger value="draft">Borradores ({surveyStats.draft})</TabsTrigger>
          <TabsTrigger value="completed">Completadas ({surveyStats.completed})</TabsTrigger>
          <TabsTrigger value="expired">Expiradas (0)</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredSurveys.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay encuestas</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all"
                    ? "No se encontraron encuestas que coincidan con tu búsqueda"
                    : `No hay encuestas en estado "${activeTab}"`}
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Encuesta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSurveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getTypeIcon(survey.type)}
                          <h3 className="text-lg font-semibold">{survey.title}</h3>
                          {getStatusBadge(survey.status)}
                        </div>
                        <p className="text-muted-foreground mb-4">{survey.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {survey.responses}/{survey.totalSent} respuestas
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{survey.questions} preguntas</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Creada: {survey.createdAt}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Expira: {survey.expiresAt}</span>
                          </div>
                        </div>

                        {survey.status === "active" && survey.totalSent > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progreso de respuestas</span>
                              <span>{Math.round((survey.responses / survey.totalSent) * 100)}%</span>
                            </div>
                            <Progress value={(survey.responses / survey.totalSent) * 100} className="h-2" />
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedSurvey(survey)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Resultados
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Survey Results Dialog */}
      {selectedSurvey && (
        <Dialog open={!!selectedSurvey} onOpenChange={() => setSelectedSurvey(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getTypeIcon(selectedSurvey.type)}
                <span>{selectedSurvey.title}</span>
              </DialogTitle>
              <DialogDescription>Resultados y análisis de la encuesta</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Survey Overview */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedSurvey.responses}</p>
                    <p className="text-sm text-muted-foreground">Respuestas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {Math.round((selectedSurvey.responses / selectedSurvey.totalSent) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Tasa de Respuesta</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedSurvey.questions}</p>
                    <p className="text-sm text-muted-foreground">Preguntas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Questions Results */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Resultados por Pregunta</h3>
                {mockQuestions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Pregunta {index + 1}: {question.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {question.responses.map((response, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{response.option}</span>
                              <span>
                                {response.count} ({response.percentage}%)
                              </span>
                            </div>
                            <Progress value={response.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
                <Button onClick={() => setSelectedSurvey(null)}>Cerrar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
