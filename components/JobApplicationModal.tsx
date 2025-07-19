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
      toast.error("Debes iniciar sesión para aplicar")
      return
    }

    if (!user.cvUrl) {
      toast.error("Debes subir tu CV antes de aplicar a una vacante")
      return
    }

    setIsSubmitting(true)

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

      if (!response.ok) {
        toast.error(data.error || 'Error al enviar la aplicación')
        return
      }

      toast.success('¡Aplicación enviada exitosamente!')
      onApplicationSuccess()
      onClose()
    } catch (error) {
      console.error('Error applying to job:', error)
      toast.error('Error de conexión. Intenta nuevamente.')
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
                    onClick={() => window.open(user.cvUrl!, '_blank')}
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