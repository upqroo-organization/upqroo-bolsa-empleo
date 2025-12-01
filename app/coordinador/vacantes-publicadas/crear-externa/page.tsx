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
  Send,
  FileText,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  AlertCircle,
  CalendarIcon,
  Info,
  Building2,
  ArrowLeft,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useFetch } from "@/hooks/useFetch"
import { Careers, VacanteModalityEnum, VacanteTypeEnum } from "@/types/vacantes"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TempImageUpload } from "@/components/ui/temp-image-upload"
import { Checkbox } from "@/components/ui/checkbox"

export default function CrearVacanteExterna() {
  const router = useRouter()
  // Set default deadline to 3 weeks from today
  const getDefaultDeadline = () => {
    const today = new Date()
    today.setDate(today.getDate() + 21) // 3 weeks = 21 days
    return today
  }
  const [date, setDate] = useState<Date | undefined>(getDefaultDeadline())
  const [isImageOnly, setIsImageOnly] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    responsibilities: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    department: '',
    type: '',
    modality: 'hybrid',
    numberOfPositions: '',
    career: '',
    state: undefined,
    externalCompanyName: '',
    externalCompanyEmail: '',
    externalCompanyPhone: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { data: statesData } = useFetch('/api/states')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateBasicInfo = () => {
    const basicErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      basicErrors.title = 'El título del puesto es requerido'
    }
    if (!formData.externalCompanyName.trim()) {
      basicErrors.externalCompanyName = 'El nombre de la empresa es requerido'
    }
    if (!formData.type) {
      basicErrors.type = 'El tipo de empleo es requerido'
    }
    if (!formData.modality) {
      basicErrors.modality = 'La modalidad de trabajo es requerida'
    }
    if (!formData.location.trim()) {
      basicErrors.location = 'La ubicación es requerida'
    }
    if (!formData.state) {
      basicErrors.state = 'El estado es requerido'
    }
    if (!isImageOnly && !formData.summary.trim()) {
      basicErrors.summary = 'El resumen del puesto es requerido'
    }

    return basicErrors
  }

  const validateDetails = () => {
    const detailErrors: Record<string, string> = {}

    if (isImageOnly && !selectedImage) {
      detailErrors.image = 'La imagen es requerida para vacantes de solo imagen'
    }

    if (!isImageOnly) {
      if (!formData.description.trim()) {
        detailErrors.description = 'La descripción completa es requerida'
      }
      if (!formData.responsibilities.trim()) {
        detailErrors.responsibilities = 'Las responsabilidades principales son requeridas'
      }
    }

    return detailErrors
  }

  const validateForm = () => {
    const basicErrors = validateBasicInfo()
    const detailErrors = validateDetails()
    const allErrors = { ...basicErrors, ...detailErrors }

    setErrors(allErrors)
    return Object.keys(allErrors).length === 0
  }

  const hasBasicErrors = () => {
    const basicErrors = validateBasicInfo()
    return Object.keys(basicErrors).length > 0
  }

  const hasDetailErrors = () => {
    const detailErrors = validateDetails()
    return Object.keys(detailErrors).length > 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setLoading(true)
    try {
      // First, upload the image if it exists
      let imageUrl = null
      if (selectedImage) {
        const imageFormData = new FormData()
        imageFormData.append('image', selectedImage)

        const imageResponse = await fetch('/api/uploads/job-images', {
          method: 'POST',
          body: imageFormData,
        })

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          imageUrl = imageData.url
        }
      }

      const payload = {
        title: formData.title,
        summary: isImageOnly ? 'Ver imagen para más detalles' : formData.summary,
        description: isImageOnly ? 'Ver imagen para más detalles' : formData.description,
        responsibilities: isImageOnly ? 'Ver imagen para más detalles' : formData.responsibilities,
        location: formData.location,
        salaryMin: parseInt(formData.salaryMin) || null,
        salaryMax: parseInt(formData.salaryMax) || null,
        type: formData.type,
        modality: formData.modality,
        numberOfPositions: formData.numberOfPositions && formData.numberOfPositions !== 'none' ? parseInt(formData.numberOfPositions) : null,
        career: formData.career || null,
        deadline: date ? new Date(date) : null,
        stateId: formData.state,
        externalCompanyName: formData.externalCompanyName,
        externalCompanyEmail: formData.externalCompanyEmail || null,
        externalCompanyPhone: formData.externalCompanyPhone || null,
        imageUrl,
        isImageOnly,
      }

      const response = await fetch('/api/coordinador/vacantes/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      await response.json()
      toast.success("Vacante externa creada correctamente")

      setTimeout(() => {
        router.push('/coordinador/vacantes-publicadas')
      }, 1000)
    } catch (err) {
      const errorMsg = (err instanceof Error) ? err.message : String(err)
      toast.error("Ocurrió un error al publicar: " + errorMsg)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Crear Vacante</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Publica una vacante para una empresa no registrada
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Vacantes Externas:</strong> Estas vacantes son para empresas que no están registradas en la plataforma.
          Puedes crear vacantes con imagen únicamente (flyers/carteles) o con información detallada.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 gap-2 h-auto p-2 bg-gray-50">
          <TabsTrigger
            value="basic"
            className="flex items-center justify-center gap-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-sm"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Información Básica</span>
            <span className="sm:hidden">Info Básica</span>
            {hasBasicErrors() && (
              <div className="w-2 h-2 bg-red-500 rounded-full ml-1" title="Campos requeridos faltantes" />
            )}
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex items-center justify-center gap-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-sm"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Detalles del Puesto</span>
            <span className="sm:hidden">Detalles</span>
            {hasDetailErrors() && (
              <div className="w-2 h-2 bg-red-500 rounded-full ml-1" title="Campos requeridos faltantes" />
            )}
            {selectedImage && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-1" title="Imagen seleccionada" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa Externa
              </CardTitle>
              <CardDescription>Datos de la empresa no registrada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="externalCompanyName">Nombre de la Empresa *</Label>
                <Input
                  id="externalCompanyName"
                  placeholder="Ej: Tech Solutions SA de CV"
                  className={cn(errors.externalCompanyName && "border-red-500")}
                  onChange={handleChange}
                  value={formData.externalCompanyName}
                  name="externalCompanyName"
                />
                {errors.externalCompanyName && (
                  <p className="text-xs text-red-500">{errors.externalCompanyName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="externalCompanyEmail">Email de Contacto</Label>
                  <Input
                    id="externalCompanyEmail"
                    type="email"
                    placeholder="rh@empresa.com"
                    onChange={handleChange}
                    value={formData.externalCompanyEmail}
                    name="externalCompanyEmail"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="externalCompanyPhone">Teléfono de Contacto</Label>
                  <Input
                    id="externalCompanyPhone"
                    type="tel"
                    placeholder="+52 998 123 4567"
                    onChange={handleChange}
                    value={formData.externalCompanyPhone}
                    name="externalCompanyPhone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información Básica de la Vacante
              </CardTitle>
              <CardDescription>Datos principales que verán los candidatos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isImageOnly"
                  checked={isImageOnly}
                  onCheckedChange={(checked) => setIsImageOnly(checked as boolean)}
                />
                <Label htmlFor="isImageOnly" className="text-sm font-normal cursor-pointer">
                  Vacante de solo imagen (flyer/cartel)
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Título del Puesto *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Ej: Desarrollador Frontend React Jr"
                  className={cn("text-lg font-medium", errors.title && "border-red-500")}
                  onChange={handleChange}
                  value={formData.title}
                  name="title"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="career">Carrera dirigida</Label>
                  <Select onValueChange={(val) => handleSelectChange("career", val)} value={formData.career}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(Careers).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Tipo de Empleo *</Label>
                  <Select onValueChange={(val) => handleSelectChange("type", val)} value={formData.type}>
                    <SelectTrigger className={cn(errors.type && "border-red-500")}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VacanteTypeEnum).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-xs text-red-500">{errors.type}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Modalidad de Trabajo *</Label>
                <RadioGroup
                  onValueChange={(val) => handleSelectChange("modality", val)}
                  defaultValue="hybrid"
                  className="flex flex-col space-y-2"
                  value={formData.modality}
                >
                  {Object.entries(VacanteModalityEnum).map(([key, label]) => {
                    const Icon =
                      key === "onSite"
                        ? MapPin
                        : key === "remote"
                          ? Clock
                          : Users;

                    return (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    onChange={handleChange}
                    name="location"
                    id="location"
                    className={cn(errors.location && "border-red-500")}
                    placeholder="Ej: Cancún, Quintana Roo"
                    value={formData.location}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500">{errors.location}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Select onValueChange={(val) => handleSelectChange("state", val)} value={formData.state}>
                    <SelectTrigger className={cn("w-full", errors.state && "border-red-500")}>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {statesData?.data && Array.isArray(statesData.data) && statesData.data.map((state: { id: string; name: string }) => (
                        <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-xs text-red-500">{errors.state}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positions">Número de Vacantes</Label>
                  <Select onValueChange={(val) => handleSelectChange("numberOfPositions", val)} value={formData.numberOfPositions || "none"}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el número de vacantes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No especificado</SelectItem>
                      <SelectItem value="1">1 vacante</SelectItem>
                      <SelectItem value="2">2 vacantes</SelectItem>
                      <SelectItem value="3">3 vacantes</SelectItem>
                      <SelectItem value="5">5 vacantes</SelectItem>
                      <SelectItem value="10">10+ vacantes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!isImageOnly && (
                <div className="space-y-2">
                  <Label htmlFor="summary">Resumen del Puesto *</Label>
                  <Textarea
                    id="summary"
                    rows={3}
                    name="summary"
                    onChange={handleChange}
                    className={cn(errors.summary && "border-red-500")}
                    placeholder="Breve descripción del puesto y lo que buscas en un candidato..."
                    value={formData.summary}
                  />
                  {errors.summary && (
                    <p className="text-xs text-red-500">{errors.summary}</p>
                  )}
                </div>
              )}
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
              <CardDescription>
                {isImageOnly ? 'Sube una imagen con la información de la vacante' : 'Descripción completa y responsabilidades'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TempImageUpload
                onImageSelected={setSelectedImage}
                label={isImageOnly ? "Imagen de la Vacante *" : "Imagen de la Vacante (Opcional)"}
                description={isImageOnly ? "Sube un flyer o cartel con la información de la vacante" : "Sube una imagen para mejorar la presentación de tu vacante"}
              />
              {errors.image && (
                <p className="text-xs text-red-500">{errors.image}</p>
              )}

              {!isImageOnly && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción Completa del Puesto *</Label>
                    <Textarea
                      id="description"
                      onChange={handleChange}
                      rows={6}
                      name="description"
                      className={cn(errors.description && "border-red-500")}
                      placeholder="Describe detalladamente el puesto, las responsabilidades principales, el ambiente de trabajo, oportunidades de crecimiento..."
                      value={formData.description}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">Responsabilidades Principales *</Label>
                    <Textarea
                      id="responsibilities"
                      rows={5}
                      name="responsibilities"
                      onChange={handleChange}
                      className={cn(errors.responsibilities && "border-red-500")}
                      placeholder="• Desarrollar interfaces web responsivas&#10;• Colaborar con el equipo de diseño&#10;• Mantener código limpio y documentado&#10;• Participar en revisiones de código"
                      value={formData.responsibilities}
                    />
                    {errors.responsibilities && (
                      <p className="text-xs text-red-500">{errors.responsibilities}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Información Salarial
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin">Salario Mínimo (MXN)</Label>
                        <Input
                          onChange={handleChange}
                          name="salaryMin"
                          id="salaryMin"
                          type="number"
                          placeholder="15000"
                          value={formData.salaryMin}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryMax">Salario Máximo (MXN)</Label>
                        <Input
                          onChange={handleChange}
                          name="salaryMax"
                          id="salaryMax"
                          type="number"
                          placeholder="25000"
                          value={formData.salaryMax}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="deadline" className="text-sm font-medium flex items-center gap-2">
                  Fecha límite
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fecha límite que se mostrará la vacante. Después de la fecha seleccionada la vacante se borrará automáticamente</p>
                    </TooltipContent>
                  </Tooltip>
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button disabled={loading} onClick={handleSubmit} className="w-full sm:w-auto">
          <Send className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">
            {loading ? 'Publicando...' : 'Publicar Vacante'}
          </span>
          <span className="sm:hidden">
            {loading ? 'Publicando...' : 'Publicar'}
          </span>
        </Button>
      </div>
    </div>
  )
}
