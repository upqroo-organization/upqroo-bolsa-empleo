"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Star,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Mail,
  Clock,
} from "lucide-react"

export default function Reports() {
  const [reportDialog, setReportDialog] = useState(false)

  const reportTypes = [
    {
      id: "placements",
      title: "Reporte de Colocaciones",
      description: "Análisis de estudiantes colocados exitosamente",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      metrics: {
        total: 73,
        thisMonth: 12,
        growth: "+23%",
      },
    },
    {
      id: "companies",
      title: "Reporte de Empresas",
      description: "Estadísticas de empresas registradas y validadas",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      metrics: {
        total: 89,
        thisMonth: 5,
        growth: "+8%",
      },
    },
    {
      id: "students",
      title: "Reporte de Estudiantes",
      description: "Análisis del rendimiento estudiantil",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      metrics: {
        total: 1247,
        thisMonth: 45,
        growth: "+12%",
      },
    },
    {
      id: "jobs",
      title: "Reporte de Vacantes",
      description: "Estadísticas de vacantes publicadas y su rendimiento",
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      metrics: {
        total: 156,
        thisMonth: 28,
        growth: "+18%",
      },
    },
    {
      id: "satisfaction",
      title: "Reporte de Satisfacción",
      description: "Encuestas y feedback de estudiantes y empresas",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      metrics: {
        total: 4.2,
        thisMonth: 4.5,
        growth: "+7%",
      },
    },
    {
      id: "performance",
      title: "Reporte de Rendimiento",
      description: "KPIs y métricas clave del sistema",
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      metrics: {
        total: 85,
        thisMonth: 88,
        growth: "+3%",
      },
    },
  ]

  const recentReports = [
    {
      id: 1,
      name: "Colocaciones Q1 2024",
      type: "Colocaciones",
      generatedDate: "2024-01-15",
      generatedBy: "Dr. María González",
      status: "completed",
      downloads: 23,
      format: "PDF",
    },
    {
      id: 2,
      name: "Empresas Validadas Enero",
      type: "Empresas",
      generatedDate: "2024-01-10",
      generatedBy: "Lic. Carlos Pérez",
      status: "completed",
      downloads: 15,
      format: "Excel",
    },
    {
      id: 3,
      name: "Rendimiento Estudiantes 2023",
      type: "Estudiantes",
      generatedDate: "2024-01-08",
      generatedBy: "Ing. Ana Rodríguez",
      status: "processing",
      downloads: 0,
      format: "PDF",
    },
    {
      id: 4,
      name: "Satisfacción Empresarial",
      type: "Satisfacción",
      generatedDate: "2024-01-05",
      generatedBy: "Dr. Luis Martínez",
      status: "completed",
      downloads: 31,
      format: "CSV",
    },
  ]

  const scheduledReports = [
    {
      id: 1,
      name: "Reporte Mensual de Colocaciones",
      frequency: "Mensual",
      nextRun: "2024-02-01",
      recipients: ["coordinador@upqroo.edu.mx", "direccion@upqroo.edu.mx"],
      format: "PDF",
      status: "active",
    },
    {
      id: 2,
      name: "Estadísticas Semanales",
      frequency: "Semanal",
      nextRun: "2024-01-22",
      recipients: ["admin@upqroo.edu.mx"],
      format: "Excel",
      status: "active",
    },
    {
      id: 3,
      name: "Reporte Trimestral Completo",
      frequency: "Trimestral",
      nextRun: "2024-04-01",
      recipients: ["rectoria@upqroo.edu.mx", "coordinador@upqroo.edu.mx"],
      format: "PDF",
      status: "paused",
    },
  ]

  const generateReport = (
    reportType: string,
    options: Record<string, unknown> = {}
  ) => {
    console.log(`Generating ${reportType} report with options:`, options)
    setReportDialog(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Procesando</Badge>
      case "failed":
        return <Badge variant="destructive">Error</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Activo</Badge>
      case "paused":
        return <Badge variant="secondary">Pausado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reportes y Análisis</h1>
          <p className="text-muted-foreground">Generación de reportes y análisis estadístico de la plataforma</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar Datos
          </Button>
          <Dialog open={reportDialog} onOpenChange={setReportDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generar Nuevo Reporte</DialogTitle>
                <DialogDescription>Configura los parámetros para generar un reporte personalizado</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-type">Tipo de Reporte</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de reporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placements">Colocaciones</SelectItem>
                      <SelectItem value="companies">Empresas</SelectItem>
                      <SelectItem value="students">Estudiantes</SelectItem>
                      <SelectItem value="jobs">Vacantes</SelectItem>
                      <SelectItem value="satisfaction">Satisfacción</SelectItem>
                      <SelectItem value="performance">Rendimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-range">Período</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mes</SelectItem>
                      <SelectItem value="quarter">Último trimestre</SelectItem>
                      <SelectItem value="year">Último año</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format">Formato</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReportDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => generateReport("custom")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${report.bgColor}`}>
                  <report.icon className={`h-5 w-5 ${report.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="text-sm">{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold">{report.metrics.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Este mes</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{report.metrics.thisMonth}</span>
                    <Badge variant="outline" className="text-green-600">
                      {report.metrics.growth}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Gráficos
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for Recent and Scheduled Reports */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Reportes Recientes</TabsTrigger>
          <TabsTrigger value="scheduled">Reportes Programados</TabsTrigger>
          <TabsTrigger value="analytics">Análisis Avanzado</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Reportes Generados Recientemente
              </CardTitle>
              <CardDescription>Historial de reportes generados en los últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Tipo: {report.type}</span>
                          <span>Generado: {report.generatedDate}</span>
                          <span>Por: {report.generatedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(report.status)}
                      <Badge variant="outline">{report.format}</Badge>
                      <div className="text-sm text-muted-foreground">{report.downloads} descargas</div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Reportes Programados
                </div>
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Programar Nuevo
                </Button>
              </CardTitle>
              <CardDescription>Reportes configurados para generación automática</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Frecuencia: {report.frequency}</span>
                          <span>Próxima ejecución: {report.nextRun}</span>
                          <span>{report.recipients.length} destinatarios</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(report.status)}
                      <Badge variant="outline">{report.format}</Badge>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Tendencias de Colocación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Gráfico de tendencias</p>
                    <p className="text-sm text-muted-foreground">Datos de los últimos 12 meses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribución por Carrera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Gráfico circular</p>
                    <p className="text-sm text-muted-foreground">Colocaciones por programa académico</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Rendimiento por Empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Gráfico de barras</p>
                    <p className="text-sm text-muted-foreground">Top 10 empresas contratantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Métricas Clave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tasa de Colocación</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "73%" }}></div>
                      </div>
                      <span className="text-sm font-medium">73%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satisfacción Empresarial</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "84%" }}></div>
                      </div>
                      <span className="text-sm font-medium">4.2/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tiempo Promedio de Colocación</span>
                    <span className="text-sm font-medium">45 días</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Empresas Activas</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
