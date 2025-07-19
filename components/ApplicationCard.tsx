'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, MapPin, Calendar, Eye, MessageSquare, X } from "lucide-react"
import { ApplicationWithVacante } from "@/hooks/useMyApplications"

interface ApplicationCardProps {
  application: ApplicationWithVacante
  onViewDetails?: (application: ApplicationWithVacante) => void
  onRemove?: (applicationId: string) => void
}

export default function ApplicationCard({ 
  application, 
  onViewDetails, 
  onRemove 
}: ApplicationCardProps) {
  
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
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    } else if (min) {
      return `Desde $${min.toLocaleString()}`
    } else if (max) {
      return `Hasta $${max.toLocaleString()}`
    }
    return "Salario no especificado"
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return "Hace 1 día"
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString("es-ES")
    }
  }

  const { vacante } = application

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{vacante.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {vacante.company.name}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {vacante.location} {vacante.state && `- ${vacante.state.name}`}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Postulado {formatDate(application.appliedAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusStyling(application.status)}>
              {getStatusText(application.status)}
            </Badge>
            {onRemove && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onRemove(application.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {vacante.type && (
              <Badge variant="secondary">{vacante.type}</Badge>
            )}
            {vacante.modality && (
              <Badge variant="outline">{vacante.modality}</Badge>
            )}
            <span className="text-green-600 font-semibold">
              {formatSalary(vacante.salaryMin, vacante.salaryMax)}
            </span>
          </div>

          {vacante.summary && (
            <p className="text-sm text-gray-700 line-clamp-2">{vacante.summary}</p>
          )}

          {vacante.deadline && new Date(vacante.deadline) > new Date() && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Fecha límite:</strong> {new Date(vacante.deadline).toLocaleDateString("es-ES")}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails?.(application)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalles
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contactar
            </Button>
            {application.status === "accepted" && (
              <Button size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Ver Siguiente Paso
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}