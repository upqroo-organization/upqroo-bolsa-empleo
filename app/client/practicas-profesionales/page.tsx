import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  FileText,
  Building2,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Eye,
  Plus,
} from "lucide-react"

export default function Internships() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Prácticas Profesionales</h1>
          <p className="text-muted-foreground">Gestiona tus prácticas profesionales y estadías</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Solicitar Práctica
        </Button>
      </div>

      {/* Current Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Práctica Actual
          </CardTitle>
          <CardDescription>TechStart Solutions - Desarrollador Frontend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Enero 2024 - Julio 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">240 / 480 horas completadas</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Supervisor: Ing. María González</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso de horas</span>
              <span>50% (240/480 horas)</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
          <div className="flex gap-3">
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Registrar Horas
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalles
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Actual</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* Current Internship Details */}
        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">TechStart Solutions</h3>
                      <p className="text-muted-foreground">Empresa de desarrollo de software</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Cancún, Quintana Roo</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">
                    Empresa especializada en desarrollo de aplicaciones web y móviles para el sector turístico y
                    empresarial de la región.
                  </p>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Proyecto Asignado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-semibold">Sistema de Reservas Hoteleras</h3>
                  <p className="text-sm text-muted-foreground">
                    Desarrollo de una plataforma web para la gestión de reservas hoteleras con integración de pagos y
                    sistema de notificaciones.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Tecnologías utilizadas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Node.js", "MongoDB", "Stripe API", "Socket.io"].map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Registro Semanal de Horas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { week: "Semana 1 (Jun 10-14)", hours: 40, status: "Aprobado" },
                      { week: "Semana 2 (Jun 17-21)", hours: 40, status: "Aprobado" },
                      { week: "Semana 3 (Jun 24-28)", hours: 35, status: "Pendiente" },
                      { week: "Semana 4 (Jul 1-5)", hours: 0, status: "Sin registrar" },
                    ].map((week, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{week.week}</p>
                          <p className="text-sm text-muted-foreground">{week.hours} horas</p>
                        </div>
                        <Badge
                          variant={
                            week.status === "Aprobado"
                              ? "default"
                              : week.status === "Pendiente"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {week.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Registrar Horas Hoy
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Subir Reporte Semanal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Contactar Supervisor
                  </Button>
                </CardContent>
              </Card>

              {/* Supervisor Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Supervisor Asignado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold">Ing. María González</h3>
                    <p className="text-sm text-muted-foreground">Líder de Desarrollo Frontend</p>
                    <p className="text-sm text-muted-foreground">maria.gonzalez@techstart.com</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Enviar Mensaje
                  </Button>
                </CardContent>
              </Card>

              {/* Next Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Fechas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded">
                      <Calendar className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Reporte Mensual</p>
                      <p className="text-xs text-muted-foreground">Vence: 30 de Junio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Evaluación Intermedia</p>
                      <p className="text-xs text-muted-foreground">Fecha: 15 de Julio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Available Internships */}
        <TabsContent value="available" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Actualmente tienes una práctica activa. Podrás aplicar a nuevas oportunidades al completar tu práctica
              actual.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                company: "DataCorp Analytics",
                position: "Analista de Datos Jr",
                duration: "6 meses",
                hours: "480 horas",
                location: "Playa del Carmen",
                requirements: ["Python", "SQL", "Excel"],
              },
              {
                company: "Creative Digital",
                position: "Diseñador UX/UI",
                duration: "4 meses",
                hours: "320 horas",
                location: "Cancún",
                requirements: ["Figma", "Adobe XD", "Photoshop"],
              },
            ].map((internship, index) => (
              <Card key={index} className="opacity-50">
                <CardHeader>
                  <CardTitle className="text-lg">{internship.position}</CardTitle>
                  <CardDescription>{internship.company}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {internship.duration} • {internship.hours}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{internship.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {internship.requirements.map((req, reqIndex) => (
                      <Badge key={reqIndex} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                  <Button disabled className="w-full">
                    No Disponible
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reportes y Documentos</CardTitle>
              <CardDescription>Gestiona tus reportes semanales y documentos de práctica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Reportes Semanales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { week: "Semana 1", status: "Entregado", date: "14 Jun 2024" },
                      { week: "Semana 2", status: "Entregado", date: "21 Jun 2024" },
                      { week: "Semana 3", status: "Pendiente", date: "28 Jun 2024" },
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{report.week}</p>
                          <p className="text-xs text-muted-foreground">{report.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={report.status === "Entregado" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                          {report.status === "Entregado" && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Nuevo Reporte
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Documentos Oficiales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Carta de Presentación", status: "Aprobado" },
                      { name: "Convenio de Práctica", status: "Firmado" },
                      { name: "Plan de Trabajo", status: "Aprobado" },
                      { name: "Evaluación Final", status: "Pendiente" },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={doc.status === "Aprobado" || doc.status === "Firmado" ? "default" : "secondary"}
                          >
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Prácticas</CardTitle>
              <CardDescription>Registro de todas tus prácticas profesionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-l-primary p-4 bg-primary/5 rounded-r-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Desarrollador Frontend - TechStart Solutions</h3>
                      <p className="text-sm text-muted-foreground">Enero 2024 - Presente</p>
                      <p className="text-sm mt-2">
                        Desarrollo de interfaces web responsivas y aplicaciones React para el sector turístico.
                      </p>
                    </div>
                    <Badge>En Progreso</Badge>
                  </div>
                </div>

                <div className="border-l-4 border-l-muted p-4 bg-muted/20 rounded-r-lg opacity-75">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Servicio Social - Municipio de Benito Juárez</h3>
                      <p className="text-sm text-muted-foreground">Agosto 2023 - Diciembre 2023</p>
                      <p className="text-sm mt-2">
                        Desarrollo de sistema de gestión documental para el área de recursos humanos.
                      </p>
                    </div>
                    <Badge variant="outline">Completado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
