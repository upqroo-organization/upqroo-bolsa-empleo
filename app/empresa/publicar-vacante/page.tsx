import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  X,
  Save,
  Eye,
  Send,
  FileText,
  MapPin,
  DollarSign,
  Clock,
  Users,
  GraduationCap,
  Briefcase,
  AlertCircle,
} from "lucide-react"

export default function PostJob() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Publicar Nueva Vacante</h1>
          <p className="text-muted-foreground">Crea una nueva oportunidad laboral para estudiantes de UPQROO</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Publicar Vacante
          </Button>
        </div>
      </div>

      {/* Progress Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Las vacantes completas y detalladas reciben 3x más postulaciones. Completa todos los
          campos para mejores resultados.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Información Básica
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Detalles del Puesto
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Requisitos
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Beneficios
          </TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información Básica de la Vacante
              </CardTitle>
              <CardDescription>Datos principales que verán los candidatos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Título del Puesto *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Ej: Desarrollador Frontend React Jr"
                  className="text-lg font-medium"
                />
                <p className="text-xs text-muted-foreground">
                  Usa un título claro y específico. Incluye el nivel (Jr, Sr) si aplica.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Tecnología</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Ventas</SelectItem>
                      <SelectItem value="hr">Recursos Humanos</SelectItem>
                      <SelectItem value="finance">Finanzas</SelectItem>
                      <SelectItem value="operations">Operaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Tipo de Empleo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Tiempo Completo</SelectItem>
                      <SelectItem value="part-time">Medio Tiempo</SelectItem>
                      <SelectItem value="internship">Prácticas Profesionales</SelectItem>
                      <SelectItem value="contract">Por Contrato</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Modalidad de Trabajo *</Label>
                <RadioGroup defaultValue="hybrid" className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="onsite" id="onsite" />
                    <Label htmlFor="onsite" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Presencial
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remote" id="remote" />
                    <Label htmlFor="remote" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Remoto
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <Label htmlFor="hybrid" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Híbrido
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input id="location" placeholder="Ej: Cancún, Quintana Roo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positions">Número de Vacantes</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 vacante</SelectItem>
                      <SelectItem value="2">2 vacantes</SelectItem>
                      <SelectItem value="3">3 vacantes</SelectItem>
                      <SelectItem value="5">5 vacantes</SelectItem>
                      <SelectItem value="10">10+ vacantes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Resumen del Puesto *</Label>
                <Textarea
                  id="summary"
                  rows={3}
                  placeholder="Breve descripción del puesto y lo que buscas en un candidato..."
                />
                <p className="text-xs text-muted-foreground">Este resumen aparecerá en los resultados de búsqueda.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Details */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Detalles del Puesto
              </CardTitle>
              <CardDescription>Descripción completa y responsabilidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Descripción Completa del Puesto *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="Describe detalladamente el puesto, las responsabilidades principales, el ambiente de trabajo, oportunidades de crecimiento..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsabilidades Principales *</Label>
                <Textarea
                  id="responsibilities"
                  rows={5}
                  placeholder="• Desarrollar interfaces web responsivas&#10;• Colaborar con el equipo de diseño&#10;• Mantener código limpio y documentado&#10;• Participar en revisiones de código"
                />
                <p className="text-xs text-muted-foreground">
                  Usa viñetas (•) para listar las responsabilidades principales.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Nivel de Experiencia</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Sin experiencia / Recién egresado</SelectItem>
                      <SelectItem value="junior">Junior (0-2 años)</SelectItem>
                      <SelectItem value="mid">Intermedio (2-5 años)</SelectItem>
                      <SelectItem value="senior">Senior (5+ años)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Horario de Trabajo</Label>
                  <Input id="schedule" placeholder="Ej: Lunes a Viernes 9:00 - 18:00" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Información Salarial
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Salario Mínimo (MXN)</Label>
                    <Input id="salaryMin" type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Salario Máximo (MXN)</Label>
                    <Input id="salaryMax" type="number" placeholder="25000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryPeriod">Período</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="biweekly">Quincenal</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="hourly">Por Hora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="negotiable" />
                  <Label htmlFor="negotiable" className="text-sm">
                    Salario negociable según experiencia
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Requisitos y Qualificaciones
              </CardTitle>
              <CardDescription>Define qué buscas en los candidatos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Carreras Preferidas</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Ingeniería en Software",
                    "Ingeniería en Sistemas",
                    "Ingeniería Industrial",
                    "Licenciatura en Administración",
                    "Diseño Gráfico",
                    "Marketing Digital",
                  ].map((career, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={career} defaultChecked={index < 2} />
                      <Label htmlFor={career} className="text-sm">
                        {career}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Habilidades Técnicas Requeridas</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["JavaScript", "React", "HTML/CSS", "Git"].map((skill, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive-foreground" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Agregar habilidad técnica..." className="flex-1" />
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Habilidades Deseables (Opcionales)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["Node.js", "TypeScript", "AWS"].map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Agregar habilidad deseable..." className="flex-1" />
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Nivel Educativo Mínimo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante (cursando carrera)</SelectItem>
                    <SelectItem value="graduate">Recién egresado</SelectItem>
                    <SelectItem value="bachelor">Licenciatura/Ingeniería</SelectItem>
                    <SelectItem value="master">Maestría</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Idiomas</Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="spanish">Español</Label>
                      <Select defaultValue="native">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Básico</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                          <SelectItem value="native">Nativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="english">Inglés</Label>
                      <Select defaultValue="intermediate">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No requerido</SelectItem>
                          <SelectItem value="basic">Básico</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                          <SelectItem value="native">Nativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="other">Otro Idioma</Label>
                      <Input id="other" placeholder="Ej: Francés (Básico)" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">Requisitos Adicionales</Label>
                <Textarea
                  id="additional"
                  rows={3}
                  placeholder="Otros requisitos como disponibilidad de horario, licencia de conducir, etc."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits */}
        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Beneficios y Condiciones
              </CardTitle>
              <CardDescription>Qué ofreces a los candidatos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Beneficios Incluidos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Seguro de Gastos Médicos",
                    "Vales de Despensa",
                    "Aguinaldo",
                    "Vacaciones",
                    "Prima Vacacional",
                    "Capacitación y Desarrollo",
                    "Home Office",
                    "Horarios Flexibles",
                    "Bonos por Desempeño",
                    "Transporte",
                    "Comedor",
                    "Gimnasio",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={benefit} defaultChecked={index < 6} />
                      <Label htmlFor={benefit} className="text-sm">
                        {benefit}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalBenefits">Beneficios Adicionales</Label>
                <Textarea
                  id="additionalBenefits"
                  rows={3}
                  placeholder="Describe otros beneficios únicos que ofrece tu empresa..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workEnvironment">Ambiente de Trabajo</Label>
                <Textarea
                  id="workEnvironment"
                  rows={3}
                  placeholder="Describe el ambiente de trabajo, cultura de la empresa, oportunidades de crecimiento..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio Deseada</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">Fecha Límite de Postulación</Label>
                  <Input id="applicationDeadline" type="date" />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Proceso de Selección</Label>
                <div className="space-y-2">
                  {[
                    "Revisión de CV",
                    "Entrevista telefónica/virtual",
                    "Entrevista presencial",
                    "Prueba técnica",
                    "Referencias laborales",
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={step} defaultChecked={index < 3} />
                      <Label htmlFor={step} className="text-sm">
                        {step}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInstructions">Instrucciones para Postularse</Label>
                <Textarea
                  id="contactInstructions"
                  rows={3}
                  placeholder="Instrucciones específicas sobre cómo postularse, documentos requeridos, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vista Previa de la Vacante
              </CardTitle>
              <CardDescription>Así verán los estudiantes tu vacante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-background border rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Desarrollador Frontend React Jr</h3>
                      <p className="text-muted-foreground">TechCorp México</p>
                    </div>
                    <Badge>Tiempo Completo</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Cancún, Quintana Roo
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      $15,000 - $25,000
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Publicado hoy
                    </div>
                  </div>
                  <p className="text-sm">
                    Buscamos un desarrollador frontend junior para unirse a nuestro equipo dinámico...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["JavaScript", "React", "HTML/CSS", "Git"].map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline">Cancelar</Button>
        <Button variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Guardar Borrador
        </Button>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Publicar Vacante
        </Button>
      </div>
    </div>
  )
}
