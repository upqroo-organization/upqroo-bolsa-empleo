'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Save,
  Send,
  FileText,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  AlertCircle,
  CalendarIcon,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function PostJob() {
  const { data: user } = useSession()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    responsibilities: '',
    location: '',
    schedule: '',
    salaryMin: '',
    salaryMax: '',
    department: '',
    type: '',
    modality: 'hybrid',
    experienceLevel: '',
    numberOfPositions: '1',
    companyId: '',
    isMock: false,
    applicationProcess: 'open'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.user?.id) {
      setFormData(prev => ({
        ...prev,
        companyId: user.user.id ?? ''
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (isMock?: boolean) => {
    setLoading(true)
    console.log(formData)
    const payload = {
      ...formData,
      salaryMin: parseInt(formData.salaryMin) || null,
      salaryMax: parseInt(formData.salaryMax) || null,
      numberOfPositions: parseInt(formData.numberOfPositions) || null,
      isMock: isMock || false,
      deadline: date ? new Date(date) : null,
    }
    fetch('/api/company/vacante', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.status === 201 ? res.json() : Promise.reject(res.status))
    .then(data => {
      console.log("Vacante creada:", data)
      alert("Vacante publicada correctamente")
    })
    .catch(err => {
      const errorMsg = (err instanceof Error) ? err.message : String(err)
      console.log(err)
      alert("Ocurrió un error al publicar: " + errorMsg)
      console.error(err)
    })
    .finally(() => {
      setLoading(false)
    })
  }

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
            <Save className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button disabled={loading} onClick={() => handleSubmit()}>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Información Básica
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Detalles del Puesto
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
                  onChange={handleChange}
                  value={formData.title}
                  name="title"
                />
                <p className="text-xs text-muted-foreground">
                  Usa un título claro y específico. Incluye el nivel (Jr, Sr) si aplica.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select onValueChange={(val) => handleSelectChange("department", val)}  value={formData.department}>
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
                  <Select onValueChange={(val) => handleSelectChange("type", val)} defaultValue="full-time"  value={formData.type}>
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
                <RadioGroup onValueChange={(val) => handleSelectChange("modality", val)} defaultValue="hybrid" className="flex flex-col space-y-2"  value={formData.modality}>
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
                  <Input 
                    onChange={handleChange} 
                    name="location" 
                    id="location" 
                    placeholder="Ej: Cancún, Quintana Roo" value={formData.location} />
                
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positions">Número de Vacantes</Label>
                  <Select onValueChange={(val) => handleSelectChange("numberOfPositions", val)} defaultValue="1"  value={formData.numberOfPositions}>
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
                  name="summary"
                  onChange={handleChange}
                  placeholder="Breve descripción del puesto y lo que buscas en un candidato..."
                  value={formData.summary}
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
                  onChange={handleChange}
                  rows={6}
                  name="description"
                  placeholder="Describe detalladamente el puesto, las responsabilidades principales, el ambiente de trabajo, oportunidades de crecimiento..."
                  value={formData.description}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsabilidades Principales *</Label>
                <Textarea
                  id="responsibilities"
                  rows={5}
                  name="responsibilities"
                  onChange={handleChange}
                  placeholder="• Desarrollar interfaces web responsivas&#10;• Colaborar con el equipo de diseño&#10;• Mantener código limpio y documentado&#10;• Participar en revisiones de código"
                  value={formData.responsibilities}
                />
                <p className="text-xs text-muted-foreground">
                  Usa viñetas (•) para listar las responsabilidades principales.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Nivel de Experiencia</Label>
                  <Select onValueChange={(val) => handleSelectChange("experienceLevel", val)}  value={formData.experienceLevel}>
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
                  <Input onChange={handleChange} 
                    name="schedule" 
                    id="schedule"
                     placeholder="Ej: Lunes a Viernes 9:00 - 18:00" value={formData.schedule}/>

                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Información Salarial
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Salario Mínimo (MXN)</Label>
                    <Input onChange={handleChange} 
                      name="salaryMin" 
                      id="salaryMin" 
                      type="number" 
                      placeholder="15000" value={formData.salaryMin} />
                    

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Salario Máximo (MXN)</Label>
                    <Input onChange={handleChange} 
                      name="salaryMax" 
                      id="salaryMax" 
                      type="number" 
                      placeholder="25000"  value={formData.salaryMax} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="deadline" className="text-sm font-medium">
                  Fecha límite
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={() => handleSubmit(true)} variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Guardar Borrador
        </Button>
        <Button disabled={loading} onClick={() => handleSubmit()}>
          <Send className="mr-2 h-4 w-4" />
          Publicar Vacante
        </Button>
      </div>
    </div>
  )
}
