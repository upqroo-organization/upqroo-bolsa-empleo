'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Building2, MapPin, DollarSign, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import { VacanteInterface } from "@/types/vacantes"
import { User } from "@/types/users"
import { toast } from "sonner"

interface JobApplicationModalProps {
  vacante: VacanteInterface | null
  user: User | null
  isOpen: boolean
  onClose: () => void
  onApplicationSuccess: () => void
}

export default function JobApplicationModal({ 
  vacante, 
  user, 
  isOpen, 
  onClose, 
  onApplicationSuccess 
}: JobApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!vacante) return null

  const handleApply = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para aplicar", {
        description: "Inicia sesión para poder postularte a esta vacante",
        duration: 4000,
        style: {
          background: '#fef2f2',
          borderColor: '#fecaca',
          color: '#dc2626'
        }
      })
      return
    }

    if (!user.cvUrl) {
      toast.error("CV requerido", {
        description: "Debes subir tu CV antes de aplicar a una vacante",
        duration: 5000,
        style: {
          background: '#fef2f2',
          borderColor: '#fecaca',
          color: '#dc2626'
        },
        action: {
          label: "Subir CV",
          onClick: () => window.open('/client/perfil', '_blank')
        }
      })
      return
    }

    setIsSubmitting(true)

    // Show loading toast
    const loadingToast = toast.loading("Enviando aplicación...", {
      description: "Procesando tu aplicación, por favor espera",
      style: {
        background: '#f0f9ff',
        borderColor: '#bae6fd',
        color: '#0369a1'
      }
    })

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vacanteId: vacante.id
        })
      })

      const data = await response.json()

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      if (!response.ok) {
        if (response.status === 400 && data.error?.includes('Ya has aplicado')) {
          toast.warning("Ya aplicaste a esta vacante", {
            description: "No puedes aplicar múltiples veces a la misma vacante",
            duration: 4000,
            style: {
              background: '#fffbeb',
              borderColor: '#fed7aa',
              color: '#d97706'
            }
          })
        } else {
          toast.error("Error al enviar aplicación", {
            description: data.details || data.error || 'No se pudo procesar tu aplicación',
            duration: 5000,
            style: {
              background: '#fef2f2',
              borderColor: '#fecaca',
              color: '#dc2626'
            }
          })
        }
        return
      }

      toast.success("¡Aplicación enviada exitosamente!", {
        description: data.details || `Tu aplicación para ${vacante.title} en ${vacante.company.name} ha sido enviada`,
        duration: 6000,
        style: {
          background: '#f0fdf4',
          borderColor: '#bbf7d0',
          color: '#16a34a'
        }
      })
      
      onApplicationSuccess()
      onClose()
    } catch (error) {
      console.error('Error applying to job:', error)
      // Dismiss loading toast
      toast.dismiss(loadingToast)
      
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.",
        duration: 5000,
        style: {
          background: '#fef2f2',
          borderColor: '#fecaca',
          color: '#dc2626'
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Aplicar a la vacante</DialogTitle>
          <DialogDescription>
            Revisa los detalles de la vacante y tu CV antes de enviar tu aplicación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{vacante.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Building2 className="h-4 w-4" />
                {vacante.company.name}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {vacante.type && (
                <Badge variant="secondary">{vacante.type}</Badge>
              )}
              {vacante.modality && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {vacante.modality}
                </Badge>
              )}
              {vacante.career && (
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {vacante.career}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {vacante.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{vacante.location}</span>
                </div>
              )}
              
              {(vacante.salaryMin || vacante.salaryMax) && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-green-600 font-medium">
                    {vacante.salaryMin && vacante.salaryMax 
                      ? `$${vacante.salaryMin.toLocaleString()} - $${vacante.salaryMax.toLocaleString()}`
                      : vacante.salaryMin 
                        ? `Desde $${vacante.salaryMin.toLocaleString()}`
                        : `Hasta $${vacante.salaryMax?.toLocaleString()}`
                    }
                  </span>
                </div>
              )}

              {vacante.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Fecha límite: {new Date(vacante.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* CV Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Tu CV</h3>
            
            {user?.cvUrl ? (
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-800">CV disponible</p>
                    <p className="text-sm text-green-600">
                      Tu CV será enviado junto con tu aplicación
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('api/' + user.cvUrl!, '_blank')}
                  >
                    Ver CV
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-red-800">CV no disponible</p>
                    <p className="text-sm text-red-600">
                      Debes subir tu CV antes de aplicar a una vacante
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/client/perfil', '_blank')}
                  >
                    Subir CV
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Application Process */}
          {vacante.applicationProcess && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Proceso de aplicación</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {vacante.applicationProcess}
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApply}
              disabled={isSubmitting || !user?.cvUrl}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Enviar Aplicación
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}