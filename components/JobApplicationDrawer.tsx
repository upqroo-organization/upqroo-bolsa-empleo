import { ApplicationWithVacante } from "@/hooks/useMyApplications"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Clock, DollarSign, Calendar, CheckCircle, FileText, MessageSquare } from "lucide-react"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

dayjs.extend(relativeTime)
dayjs.locale('es')

interface JobApplicationDrawerProps {
  application: ApplicationWithVacante | null
  isOpen: boolean
  onClose: () => void
  onContact?: () => void
}

export default function JobApplicationDrawer({ 
  application, 
  isOpen, 
  onClose,
  onContact
}: JobApplicationDrawerProps) {
  if (!application) return null
  
  const { vacante } = application

  // Helper function to get status styling
  const getStatusStyling = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "bg-gray-100 text-gray-800 border-gray-200"
      case 'accepted':
        return "bg-green-100 text-green-800 border-green-200"
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  // Helper function to format status text
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "Postulación enviada"
      case 'accepted':
        return "Aceptada"
      case 'rejected':
        return "Rechazada"
      default:
        return status
    }
  }

  // Helper function to format salary
  const formatSalary = (min: number | null, max: number | null) => {
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()}`
    } else if (min) {
      return `Desde ${min.toLocaleString()}`
    } else if (max) {
      return `Hasta ${max.toLocaleString()}`
    }
    return "Salario no especificado"
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full !sm:w-[540px] !max-w-[70vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{vacante.title}</SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              {vacante.company.name}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Application Status */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>Estado de la postulación:</span>
            </div>
            <Badge className={getStatusStyling(application.status)}>
              {getStatusText(application.status)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>Postulado el {dayjs(application.appliedAt).format('DD/MM/YYYY')}</span>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {vacante.location} {vacante?.state?.name && `- ${vacante.state.name}`}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dayjs(vacante.deadline || undefined).fromNow()}
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

            {(vacante.salaryMin || vacante.salaryMax) && (
              <div className="flex items-center gap-1 text-green-600 font-semibold">
                <DollarSign className="h-4 w-4" />
                {formatSalary(vacante.salaryMin, vacante.salaryMax)}
              </div>
            )}
          </div>

          <Separator />

          {/* Summary */}
          {vacante.summary && (
            <div>
              <h3 className="font-semibold mb-2">Resumen</h3>
              <p className="text-sm text-gray-700">{vacante.summary}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Descripción del puesto</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{vacante.description}</p>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-3">
            {vacante.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Fecha límite:</span>
                <span className="font-medium">{dayjs(vacante.deadline).format('DD/MM/YYYY')}</span>
              </div>
            )}
          </div>

          {/* Status-specific information */}
          {application.status === 'accepted' && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4" />
                ¡Felicidades! Tu postulación ha sido aceptada
              </h3>
              <p className="text-sm text-green-700">
                La empresa se pondrá en contacto contigo pronto para los siguientes pasos.
              </p>
            </div>
          )}

          {application.status === 'rejected' && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-2">
                Esta postulación no fue seleccionada
              </h3>
              <p className="text-sm text-red-700">
                No te desanimes, sigue aplicando a más oportunidades.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {/* <Button 
              variant="outline"
              className="flex-1"
              onClick={onContact}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contactar Empresa
            </Button> */}
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}