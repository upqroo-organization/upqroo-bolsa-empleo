'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"
import useVacantes from "@/hooks/vacantes/useVacantes"
import useVacante from "@/hooks/vacantes/useVacante"
import VacanteCard from "@/components/VacanteCard"
import StateSelect from "@/components/StateSelector"
import { Pagination } from "@/components/Pagination"
import { Spinner } from "@/components/Spinner"
import JobDetailsDrawer from "@/components/JobDetailsDrawer"
import JobApplicationModal from "@/components/JobApplicationModal"
import { Careers, VacanteInterface, VacanteModalityEnum, VacanteTypeEnum } from "@/types/vacantes"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useUserApplications } from "@/hooks/useUserApplications"
import { toast } from "sonner"

export default function JobSearch() {
  const { 
    vacantes, 
    total, 
    titleSearch, 
    currentPage, 
    totalPages, 
    itemsPerPage,
    handleFilters, 
    handleCheckboxChange, 
    handlePageChange,
    resetFilters, 
    filters, 
    isLoading 
  } = useVacantes();
  const [selectedVacante, setSelectedVacante] = useState<VacanteInterface | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationVacante, setApplicationVacante] = useState<VacanteInterface | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { user, isAuthenticated } = useCurrentUser();
  const { hasAppliedToJob, addAppliedJob } = useUserApplications();
  
  // Get shared job ID from URL
  const sharedJobId = searchParams.get('job');
  
  // Fetch shared job data
  const { vacante: sharedVacante, isLoading: isLoadingSharedJob, error: sharedJobError } = useVacante(sharedJobId);

  // Handle URL sharing - check for shared job on mount and when shared job data loads
  useEffect(() => {
    if (sharedJobId && sharedVacante && !isLoadingSharedJob) {
      setSelectedVacante(sharedVacante);
      setIsDrawerOpen(true);
    } else if (sharedJobId && sharedJobError) {
      toast.error("Vacante no encontrada", {
        description: "No se pudo cargar la vacante compartida. Es posible que haya sido eliminada.",
        duration: 5000
      });
      // Remove invalid job parameter from URL
      const params = new URLSearchParams(searchParams);
      params.delete('job');
      const newUrl = params.toString() ? `?${params.toString()}` : '/vacantes';
      router.replace(newUrl, { scroll: false });
    }
  }, [sharedJobId, sharedVacante, isLoadingSharedJob, sharedJobError, searchParams, router]);

  const handleViewDetails = (vacante: VacanteInterface) => {
    setSelectedVacante(vacante);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVacante(null);
    // Remove job parameter from URL when closing drawer
    const params = new URLSearchParams(searchParams);
    params.delete('job');
    const newUrl = params.toString() ? `?${params.toString()}` : '/vacantes';
    router.replace(newUrl, { scroll: false });
  };

  const handleApply = (vacanteId: string) => {
    if (!session || !isAuthenticated) {
      toast.error("Inicia sesión para postularte", {
        duration: 4000,
        action: {
          label: "Iniciar Sesión",
          onClick: () => router.push("/login")
        }
      });
      return;
    }

    const vacante = vacantes.find(v => v.id === vacanteId);
    if (vacante) {
      setApplicationVacante(vacante);
      setIsApplicationModalOpen(true);
    }
  };

  const handleApplicationSuccess = () => {
    // Add the job to the applied jobs list
    if (applicationVacante) {
      addAppliedJob(applicationVacante.id);
    }
    
    toast.success("¡Aplicación procesada!", {
      description: "Tu aplicación ha sido enviada correctamente",
      duration: 4000,
      style: {
        background: '#f0fdf4',
        borderColor: '#bbf7d0',
        color: '#16a34a'
      }
    });
  };

  const handleShare = (vacante: VacanteInterface) => {
    const params = new URLSearchParams(searchParams);
    params.set('job', vacante.id);
    const shareUrl = `${window.location.origin}/vacantes?${params.toString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${vacante.title} - ${vacante.company.name}`,
        text: `Mira esta oportunidad laboral: ${vacante.title} en ${vacante.company.name}`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success("¡Enlace copiado!", {
          description: "El enlace de la vacante ha sido copiado al portapapeles",
          duration: 3000
        });
      }).catch(() => {
        toast.error("Error al copiar", {
          description: "No se pudo copiar el enlace al portapapeles",
          duration: 4000
        });
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Buscar Empleos</h1>
          <p className="text-gray-600 text-sm sm:text-base">Encuentra tu próxima oportunidad profesional</p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">¿Qué trabajo buscas?</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  onChange={(e) => { handleFilters(e.target.name, e.target.value) }}
                  name="title"
                  value={titleSearch}
                  type="text"
                  placeholder="Ej: Desarrollador, Analista, Diseñador..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <StateSelect value={filters.state} onChange={(stateId) => handleFilters("state", stateId)} />
            </div>
            <Button size="lg" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Tipo de Empleo</label>
                <div className="space-y-2">
                  {Object.entries(VacanteTypeEnum).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.type.includes(key)}
                        id={key}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("type", key, !!checked)
                        }
                      />
                      <label htmlFor={key} className="text-sm">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">Modalidad</label>
                <div className="space-y-2">
                  {Object.entries(VacanteModalityEnum).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.modality.includes(key)}
                        id={key}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("modality", key, !!checked)
                        }
                      />
                      <label htmlFor={key} className="text-sm">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">Carrera</label>
                <Select value={filters.career} onValueChange={(value) => handleFilters("career", value)}>
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

              <Button onClick={resetFilters} variant="outline" className="w-full cursor-pointer">
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Job Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-600">
              {total ? (
                <>
                  <span className="hidden sm:inline">Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, total)} de {total} empleos</span>
                  <span className="sm:hidden">{total} empleos encontrados</span>
                </>
              ) : (
                'No se encontraron empleos'
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="w-full flex justify-center py-8">
              <div className="flex items-center gap-2">
                <Spinner />
                <span className="text-gray-600">Cargando empleos...</span>
              </div>
            </div>
          ) : vacantes.length > 0 ? (
            vacantes.map((item) => (
              <VacanteCard 
                key={item.id} // Use unique ID instead of index
                vacante={item}
                hasApplied={hasAppliedToJob(item.id)}
                isAuthenticated={isAuthenticated}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                onShare={handleShare}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No se encontraron empleos</p>
              <p className="text-sm text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="w-full flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                maxVisiblePages={5}
              />
            </div>
          )}
        </div>
      </div>

      {/* Job Details Drawer */}
      <JobDetailsDrawer
        vacante={selectedVacante}
        hasApplied={selectedVacante ? hasAppliedToJob(selectedVacante.id) : false}
        isAuthenticated={isAuthenticated}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onApply={handleApply}
        onShare={handleShare}
      />

      {/* Job Application Modal */}
      <JobApplicationModal
        vacante={applicationVacante}
        user={user}
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setApplicationVacante(null);
        }}
        onApplicationSuccess={handleApplicationSuccess}
      />

      {/* Loading indicator for shared job */}
      {isLoadingSharedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <Spinner />
            <span>Cargando vacante...</span>
          </div>
        </div>
      )}
    </div>
  )
}
