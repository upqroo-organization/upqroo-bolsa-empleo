'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';

interface JobData {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  department: string | null;
  type: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  deadline: string | null;
  career: string | null;
}

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobData, setJobData] = useState<JobData>({
    id: '',
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    department: '',
    type: '',
    location: '',
    salaryMin: null,
    salaryMax: null,
    deadline: '',
    career: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/empresa/vacantes/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          const job = data.data;
          setJobData({
            id: job.id,
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements || '',
            benefits: job.benefits || '',
            department: job.department || '',
            type: job.type || '',
            location: job.location || '',
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            career: job.career || ''
          });
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
          description: jobData.description,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
          department: jobData.department || null,
          type: jobData.type || null,
          location: jobData.location || null,
          salaryMin: jobData.salaryMin || null,
          salaryMax: jobData.salaryMax || null,
          deadline: jobData.deadline || null,
          career: jobData.career || null
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
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Información principal de la vacante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título de la Vacante *</Label>
              <Input
                id="title"
                value={jobData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Desarrollador Frontend"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={jobData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe la posición y responsabilidades..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requisitos *</Label>
              <Textarea
                id="requirements"
                value={jobData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="Lista los requisitos necesarios..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="benefits">Beneficios</Label>
              <Textarea
                id="benefits"
                value={jobData.benefits}
                onChange={(e) => handleInputChange('benefits', e.target.value)}
                placeholder="Describe los beneficios ofrecidos..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles del Puesto</CardTitle>
            <CardDescription>
              Información específica sobre el puesto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={jobData.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Ej: Tecnología"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Empleo</Label>
                <Select
                  value={jobData.type || ''}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Tiempo Completo</SelectItem>
                    <SelectItem value="part-time">Medio Tiempo</SelectItem>
                    <SelectItem value="contract">Contrato</SelectItem>
                    <SelectItem value="internship">Prácticas</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={jobData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ej: Ciudad de México"
                />
              </div>

              <div>
                <Label htmlFor="career">Carrera</Label>
                <Input
                  id="career"
                  value={jobData.career || ''}
                  onChange={(e) => handleInputChange('career', e.target.value)}
                  placeholder="Ej: Ingeniería en Sistemas"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin">Salario Mínimo</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={jobData.salaryMin || ''}
                  onChange={(e) => handleInputChange('salaryMin', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Ej: 15000"
                />
              </div>

              <div>
                <Label htmlFor="salaryMax">Salario Máximo</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={jobData.salaryMax || ''}
                  onChange={(e) => handleInputChange('salaryMax', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="Ej: 25000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Fecha Límite</Label>
              <Input
                id="deadline"
                type="date"
                value={jobData.deadline || ''}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
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