'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Users, Calendar, MapPin, DollarSign, Briefcase, GraduationCap } from "lucide-react";
import Link from 'next/link';
import { toast } from 'sonner';

interface JobDetails {
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
  status: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobDetails | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/empresa/vacantes/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setJob(data.data);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activa"
      case "paused":
        return "Pausada"
      case "expired":
        return "Expirada"
      default:
        return status
    }
  }

  const getTypeLabel = (type: string | null) => {
    switch (type) {
      case "full-time":
        return "Tiempo Completo"
      case "part-time":
        return "Medio Tiempo"
      case "contract":
        return "Contrato"
      case "internship":
        return "Prácticas"
      case "freelance":
        return "Freelance"
      default:
        return type || "No especificado"
    }
  }

  const formatSalary = (salaryMin: number | null, salaryMax: number | null) => {
    if (!salaryMin && !salaryMax) return 'No especificado';
    if (salaryMin && salaryMax) return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`;
    if (salaryMin) return `Desde $${salaryMin.toLocaleString()}`;
    if (salaryMax) return `Hasta $${salaryMax.toLocaleString()}`;
    return 'No especificado';
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Vacante no encontrada</h2>
          <Link href="/empresa/gestionar-vacante">
            <Button>Volver a Gestionar Vacantes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/empresa/gestionar-vacante">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(job.status)}>
                {getStatusLabel(job.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {job.applicationsCount} postulantes
              </span>
            </div>
          </div>
        </div>
        
        <Link href={`/empresa/gestionar-vacante/${job.id}/editar`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {job.department && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Departamento</p>
                    <p className="font-medium">{job.department}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">{getTypeLabel(job.type)}</p>
                </div>
              </div>

              {job.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Salario</p>
                  <p className="font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.career && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Carrera</p>
                    <p className="font-medium">{job.career}</p>
                  </div>
                </div>
              )}

              {job.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha Límite</p>
                    <p className="font-medium">
                      {new Date(job.deadline).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Postulantes</p>
                <p className="font-medium">{job.applicationsCount} candidatos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Descripción del Puesto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requisitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        {job.benefits && (
          <Card>
            <CardHeader>
              <CardTitle>Beneficios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{job.benefits}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Publicación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fecha de Creación</p>
                <p className="font-medium">
                  {new Date(job.createdAt).toLocaleString('es-ES')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Última Actualización</p>
                <p className="font-medium">
                  {new Date(job.updatedAt).toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}