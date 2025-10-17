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

export default function PostJob() {
  const { data: user } = useSession()
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
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
    numberOfPositions: '1',
    career: '',
    companyId: '',
    isMock: false,
    applicationProcess: 'open',
    state: undefined
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { data } = useFetch('/api/states')

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validation functions
  const validateBasicInfo = () => {
    const basicErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      basicErrors.title = 'El título del puesto es requerido'
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
    if (!formData.summary.trim()) {
      basicErrors.summary = 'El resumen del puesto es requerido'
    }

    return basicErrors
  }

  const validateDetails = () => {
    const detailErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      detailErrors.description = 'La descripción completa es requerida'
    }
    if (!formData.responsibilities.trim()) {
      detailErrors.responsibilities = 'Las responsabilidades principales son requeridas'
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

  // Check if sections have errors
  const hasBasicErrors = () => {
    const basicErrors = validateBasicInfo()
    return Object.keys(basicErrors).length > 0
  }

  const hasDetailErrors = () => {
    const detailErrors = validateDetails()
    return Object.keys(detailErrors).length > 0
  }

  const handleSubmit = async (isMock?: boolean) => {
    // Validate form before submitting
    if (!validateForm()) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        salaryMin: parseInt(formData.salaryMin) || null,
        salaryMax: parseInt(formData.salaryMax) || null,
        numberOfPositions: parseInt(formData.numberOfPositions) || null,
        isMock: isMock || false,
        deadline: date ? new Date(date) : null,
      }

      const response = await fetch('/api/vacantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.status !== 201) {
        throw new Error(`Error ${response.status}`)
      }

      const data = await response.json()
      console.log("Vacante creada:", data)

      // If there's an image, upload it after creating the job
      if (selectedImage && data?.id) {
        try {
          console.log('Uploading image for job:', data.data.id)
          const imageFormData = new FormData()
          imageFormData.append('image', selectedImage)

          const imageResponse = await fetch(`/api/empresa/vacantes/${data.data.id}/image`, {
            method: 'POST',
            body: imageFormData,
          })

          if (!imageResponse.ok) {
            const errorData = await imageResponse.json().catch(() => ({}))
            console.warn('Failed to upload image:', imageResponse.status, errorData)
            toast.success("Vacante publicada correctamente (imagen no se pudo subir)")
          } else {
            const imageData = await imageResponse.json()
            console.log('Image uploaded successfully:', imageData)
            toast.success("Vacante e imagen publicadas correctamente")
          }
        } catch (imageError) {
          console.error('Error uploading image:', imageError)
          toast.success("Vacante publicada correctamente (imagen no se pudo subir)")
        }
      } else {
        if (selectedImage) {
          console.warn('Image selected but no job ID available')
        }
        toast.success("Vacante publicada correctamente")
      }

      // Redirect to gestionar-vacantes after successful creation
      setTimeout(() => {
        router.push('/empresa/gestionar-vacante')
      }, 1000) // Small delay to show the toast
    } catch (err) {
      const errorMsg = (err instanceof Error) ? err.message : String(err)
      console.log(err)
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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Publicar Nueva Vacante</h1>
          <p className="text-sm md:text-base text-muted-foreground">Crea una nueva oportunidad laboral para estudiantes de UPQROO</p>
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
                  className={cn("text-lg font-medium", errors.title && "border-red-500")}
                  onChange={handleChange}
                  value={formData.title}
                  name="title"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Usa un título claro y específico. Incluye el nivel (Jr, Sr) si aplica.
                </p>
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
                  <Select onValueChange={(val) => handleSelectChange("type", val)} defaultValue="full-time" value={formData.type}>
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
                  defaultValue="Hybrid"
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
                {errors.modality && (
                  <p className="text-xs text-red-500">{errors.modality}</p>
                )}
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
                  <Label htmlFor="positions">Estado *</Label>
                  <Select onValueChange={(val) => handleSelectChange("state", val)} value={formData.state}>
                    <SelectTrigger className={cn("w-full", errors.state && "border-red-500")}>
                      <SelectValue className="w-full" placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.data && Array.isArray(data.data) && data.data.map(state => (<SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-xs text-red-500">{errors.state}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positions">Número de Vacantes</Label>
                  <Select onValueChange={(val) => handleSelectChange("numberOfPositions", val)} defaultValue="1" value={formData.numberOfPositions}>
                    <SelectTrigger className="w-full">
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
                  className={cn(errors.summary && "border-red-500")}
                  placeholder="Breve descripción del puesto y lo que buscas en un candidato..."
                  value={formData.summary}
                />
                {errors.summary && (
                  <p className="text-xs text-red-500">{errors.summary}</p>
                )}
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
                <p className="text-xs text-muted-foreground">
                  Usa viñetas (•) para listar las responsabilidades principales.
                </p>
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
                      placeholder="25000" value={formData.salaryMax} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="deadline" className="text-sm font-medium flex items-center gap-2">
                  Fecha límite
                  <Tooltip>
                    <TooltipTrigger> <Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Fecha limite que se mostrara la vacante. Despues de la fecha seleccionada la vacante se borrara automaticamente</p>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <TempImageUpload
                onImageSelected={setSelectedImage}
                label="Imagen de la Vacante"
                description="Sube una imagen para mejorar la presentación de tu vacante"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
        <Button variant="outline" className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button disabled={loading} onClick={() => handleSubmit()} className="w-full sm:w-auto">
          <Send className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">
            {loading ? 'Publicando...' : selectedImage ? 'Publicar Vacante e Imagen' : 'Publicar Vacante'}
          </span>
          <span className="sm:hidden">
            {loading ? 'Publicando...' : 'Publicar'}
          </span>
        </Button>
      </div>
    </div>
  )
}
