'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Save, Loader2, CalendarIcon, FileText, Briefcase, DollarSign } from "lucide-react";
import { VacanteTypeEnum, VacanteModalityEnum, Careers } from '@/types/vacantes';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { toast } from 'sonner';
import { ImageUpload } from "@/components/ui/image-upload";

interface State {
  id: number;
  name: string;
}

interface JobData {
  id: string;
  title: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  department: string | null;
  type: string | null;
  modality: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  numberOfPositions: number | null;
  deadline: string | null;
  career: string | null;
  applicationProcess: string | null;
  stateId: number | null;
  imageUrl: string | null;
}

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [states, setStates] = useState<State[]>([]);
  const [jobData, setJobData] = useState<JobData>({
    id: '',
    title: '',
    summary: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    department: '',
    type: '',
    modality: '',
    location: '',
    salaryMin: null,
    salaryMax: null,
    numberOfPositions: null,
    deadline: '',
    career: '',
    applicationProcess: '',
    stateId: null,
    imageUrl: null
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        const data = await response.json();
        if (Array.isArray(data)) {
          setStates(data);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/empresa/vacantes/${params.id}`);
        const data = await response.json();

        if (data.success) {
          const job = data.data;
          setJobData({
            id: job.id,
            title: job.title || '',
            summary: job.summary || '',
            description: job.description || '',
            responsibilities: job.responsibilities || '',
            requirements: job.requirements || '',
            benefits: job.benefits || '',
            department: job.department || '',
            type: job.type || '',
            modality: job.modality || '',
            location: job.location || '',
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            numberOfPositions: job.numberOfPositions,
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            career: job.career || '',
            applicationProcess: job.applicationProcess || '',
            stateId: job.stateId,
            imageUrl: job.imageUrl || null
          });

          // Set the date for the calendar
          if (job.deadline) {
            setDate(new Date(job.deadline));
          }
        } else {
          toast.error('Error al cargar la vacante');
          router.push('/empresa/gestionar-vacante');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Error al cargar la vacante');
        router.push('/empresa/gestionar-vacante');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStates();
      fetchJob();
    }
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/empresa/vacantes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobData.title,
          summary: jobData.summary,
          description: jobData.description,
          responsibilities: jobData.responsibilities,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
          department: jobData.department || null,
          type: jobData.type || null,
          modality: jobData.modality || null,
          location: jobData.location || null,
          salaryMin: jobData.salaryMin || null,
          salaryMax: jobData.salaryMax || null,
          numberOfPositions: jobData.numberOfPositions || null,
          deadline: date ? date.toISOString() : null,
          career: jobData.career || null,
          applicationProcess: jobData.applicationProcess || null,
          stateId: jobData.stateId || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Vacante actualizada correctamente');
        router.push('/empresa/gestionar-vacante');
      } else {
        toast.error(data.error || 'Error al actualizar la vacante');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Error al actualizar la vacante');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof JobData, value: string | number | null) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/empresa/gestionar-vacante">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Vacante</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="title">Título del Puesto *</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Desarrollador Frontend React Jr"
                    className="text-lg font-medium"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Usa un título claro y específico. Incluye el nivel (Jr, Sr) si aplica.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="career">Carrera dirigida</Label>
                    <Select
                      value={jobData.career || ''}
                      onValueChange={(value) => handleInputChange('career', value)}
                    >
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
                    <Label htmlFor="type">Tipo de Empleo *</Label>
                    <Select
                      value={jobData.type || ''}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
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
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Modalidad de Trabajo *</Label>
                  <RadioGroup
                    value={jobData.modality || ''}
                    onValueChange={(value) => handleInputChange('modality', value)}
                    className="flex flex-col space-y-2"
                  >
                    {Object.entries(VacanteModalityEnum).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="flex items-center gap-2">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input
                      id="location"
                      value={jobData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ej: Cancún, Quintana Roo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select
                      value={jobData.stateId?.toString() || ''}
                      onValueChange={(value) => handleInputChange('stateId', value ? parseInt(value) : null)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfPositions">Número de Vacantes</Label>
                    <Select
                      value={jobData.numberOfPositions?.toString() || '1'}
                      onValueChange={(value) => handleInputChange('numberOfPositions', parseInt(value))}
                    >
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
                    value={jobData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Breve descripción del puesto y lo que buscas en un candidato..."
                    required
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
                    value={jobData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe detalladamente el puesto, las responsabilidades principales, el ambiente de trabajo, oportunidades de crecimiento..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsabilidades Principales *</Label>
                  <Textarea
                    id="responsibilities"
                    rows={5}
                    value={jobData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                    placeholder="• Desarrollar interfaces web responsivas&#10;• Colaborar con el equipo de diseño&#10;• Mantener código limpio y documentado&#10;• Participar en revisiones de código"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Usa viñetas (•) para listar las responsabilidades principales.
                  </p>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos *</Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    value={jobData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Lista los requisitos necesarios..."
                    required
                  />
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="benefits">Beneficios</Label>
                  <Textarea
                    id="benefits"
                    rows={3}
                    value={jobData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    placeholder="Describe los beneficios ofrecidos..."
                  />
                </div> */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Información Salarial
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Salario Mínimo (MXN)</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={jobData.salaryMin || ''}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="15000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Salario Máximo (MXN)</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={jobData.salaryMax || ''}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="25000"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="deadline" className="text-sm font-medium">
                    Fecha límite
                  </Label>
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

                <ImageUpload
                  currentImageUrl={jobData.imageUrl}
                  onImageUploaded={(imageUrl) => handleInputChange('imageUrl', imageUrl)}
                  onImageDeleted={() => handleInputChange('imageUrl', null)}
                  uploadEndpoint={`/api/empresa/vacantes/${params.id}/image`}
                  deleteEndpoint={`/api/empresa/vacantes/${params.id}/image`}
                  label="Imagen de la Vacante"
                  description="Sube una imagen para mejorar la presentación de tu vacante"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-6">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
          <Link href="/empresa/gestionar-vacante">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}