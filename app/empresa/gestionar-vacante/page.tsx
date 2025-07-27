'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Pause,
  Play,
  Trash2,
  Copy,
  MoreHorizontal,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import ApplicantsModal from '@/components/ApplicantsModal';
import { useCompanyJobs, Job } from '@/hooks/useCompanyJobs';
import Link from 'next/link';
import { VacanteTypeEnum } from '@/types/vacantes';

const getJobTypeLabel = (type: string | null): string => {
  if (!type) return '';
  
  // Map database values to enum keys
  const typeMap: Record<string, keyof typeof VacanteTypeEnum> = {
    'Full-time': 'fullTime',
    'Part-time': 'partTime',
    'Internship': 'intership',
    'full-time': 'fullTime',
    'part-time': 'partTime',
    'internship': 'intership',
    'tiempo completo': 'fullTime',
    'tiempo parcial': 'partTime',
    'becario': 'intership',
    'fullTime': 'fullTime',
    'partTime': 'partTime',
    'intership': 'intership'
  };
  
  const enumKey = typeMap[type.toLowerCase()] || typeMap[type];
  return enumKey ? VacanteTypeEnum[enumKey] : type;
};

export default function ManageJobs() {
  const { jobs, loading, toggleJobStatus, deleteJob, duplicateJob } = useCompanyJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const openApplicantsModal = (job: Job) => {
    setSelectedJob(job);
    setIsApplicantsModalOpen(true);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (jobToDelete) {
      await deleteJob(jobToDelete.id);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleDuplicateJob = async (job: Job) => {
    await duplicateJob(job.id);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && job.status === 'active') ||
      (statusFilter === 'paused' && job.status === 'paused') ||
      (statusFilter === 'expired' && job.status === 'expired');
    
    return matchesSearch && matchesStatus;
  });

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

  const formatSalary = (salaryMin: number | null, salaryMax: number | null) => {
    if (!salaryMin && !salaryMax) return 'No especificado';
    if (salaryMin && salaryMax) return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`;
    if (salaryMin) return `Desde $${salaryMin.toLocaleString()}`;
    if (salaryMax) return `Hasta $${salaryMax.toLocaleString()}`;
    return 'No especificado';
  };

  const stats = [
    {
      icon: CheckCircle,
      value: jobs.filter((job) => job.status === "active").length,
      label: "Vacantes Activas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Users,
      value: jobs.reduce((sum, job) => sum + job.applicationsCount, 0),
      label: "Total Postulantes",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Clock,
      value: jobs.filter((job) => job.status === "paused").length,
      label: "Vacantes Pausadas",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: AlertCircle,
      value: jobs.filter((job) => job.status === "expired").length,
      label: "Vacantes Expiradas",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestionar Vacantes</h1>
          <p className="text-muted-foreground">Administra todas tus ofertas laborales</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/empresa/publicar-vacante">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Vacante
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar vacantes..." 
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
                <SelectItem value="expired">Expiradas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas ({filteredJobs.length})</TabsTrigger>
          <TabsTrigger value="active">Activas ({filteredJobs.filter((job) => job.status === "active").length})</TabsTrigger>
          <TabsTrigger value="paused">Pausadas ({filteredJobs.filter((job) => job.status === "paused").length})</TabsTrigger>
          <TabsTrigger value="expired">
            Expiradas ({filteredJobs.filter((job) => job.status === "expired").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron vacantes
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {job.department && <span>{job.department}</span>}
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Publicado {new Date(job.createdAt).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>{getStatusLabel(job.status)}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href={`/empresa/gestionar-vacante/${job.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/empresa/gestionar-vacante/${job.id}/editar`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleDuplicateJob(job)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {job.status === "active" ? (
                            <DropdownMenuItem onClick={() => toggleJobStatus(job.id, 'pause')}>
                              <Pause className="mr-2 h-4 w-4" />
                              Pausar
                            </DropdownMenuItem>
                          ) : job.status === "paused" ? (
                            <DropdownMenuItem onClick={() => toggleJobStatus(job.id, 'activate')}>
                              <Play className="mr-2 h-4 w-4" />
                              Reactivar
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteJob(job)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      {job.type && <Badge variant="secondary">{getJobTypeLabel(job.type)}</Badge>}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{job.applicationsCount} postulantes</span>
                        </div>
                        {job.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Expira {new Date(job.deadline).toLocaleDateString("es-ES")}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {job.status === "expired" && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Esta vacante ha expirado. Puedes renovarla o crear una nueva versión.
                        </AlertDescription>
                      </Alert>
                    )}

                    {job.status === "paused" && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Esta vacante está pausada y no es visible para los candidatos.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openApplicantsModal(job)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Ver Postulantes ({job.applicationsCount})
                      </Button>
                      <Link href={`/empresa/gestionar-vacante/${job.id}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      </Link>
                      {job.status === "active" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleJobStatus(job.id, 'pause')}
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pausar
                        </Button>
                      )}
                      {job.status === "paused" && (
                        <Button 
                          size="sm"
                          onClick={() => toggleJobStatus(job.id, 'activate')}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Reactivar
                        </Button>
                      )}
                      {job.status === "expired" && (
                        <Button 
                          size="sm"
                          onClick={() => toggleJobStatus(job.id, 'activate')}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Renovar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Active Jobs Tab */}
        <TabsContent value="active" className="space-y-4 mt-6">
          {filteredJobs
            .filter((job) => job.status === "active")
            .map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-green-200 bg-green-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.department} • {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activa</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{job.applicationsCount} postulantes</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openApplicantsModal(job)}
                    >
                      Ver Postulantes
                    </Button>
                    <Link href={`/empresa/gestionar-vacante/${job.id}/editar`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Paused Jobs Tab */}
        <TabsContent value="paused" className="space-y-4 mt-6">
          {filteredJobs
            .filter((job) => job.status === "paused")
            .map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow border-yellow-200 bg-yellow-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.department} • {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pausada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Esta vacante está pausada y no es visible para los candidatos.</AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => toggleJobStatus(job.id, 'activate')}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Reactivar
                    </Button>
                    <Link href={`/empresa/gestionar-vacante/${job.id}/editar`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        {/* Expired Jobs Tab */}
        <TabsContent value="expired" className="space-y-4 mt-6">
          {filteredJobs
            .filter((job) => job.status === "expired")
            .map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        {job.department} • {job.location}
                      </CardDescription>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Expirada</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Esta vacante expiró el {job.deadline && new Date(job.deadline).toLocaleDateString("es-ES")}.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => toggleJobStatus(job.id, 'activate')}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Renovar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Applicants Modal */}
      {selectedJob && (
        <ApplicantsModal
          isOpen={isApplicantsModalOpen}
          onClose={() => {
            setIsApplicantsModalOpen(false);
            setSelectedJob(null);
          }}
          vacanteId={selectedJob.id}
          vacanteTitle={selectedJob.title}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la vacante
              &quot;{jobToDelete?.title}&quot; y todos sus datos asociados.
              {jobToDelete?.applicationsCount && jobToDelete.applicationsCount > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Advertencia: Esta vacante tiene {jobToDelete.applicationsCount} postulaciones 
                  y no se puede eliminar.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!(jobToDelete?.applicationsCount && jobToDelete.applicationsCount > 0)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
