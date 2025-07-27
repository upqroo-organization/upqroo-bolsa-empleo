"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  Calendar,
  FileText,
  ExternalLink,
  Download,
  MessageSquare,
  User,
} from "lucide-react"

interface ApplicantData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  cvUrl: string | null
  position: string
  appliedDate: Date
  status: string
  vacanteId: string
  cvViewed: boolean
  hiredAt: Date | null
  career: string | null
  notes?: string | null
}

interface ApplicantProfileDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  applicant: ApplicantData | null
  onViewCV?: (cvUrl: string, applicationId: string) => void
  onDownloadCV?: (cvUrl: string, applicantName: string, applicationId: string) => void
}

export default function ApplicantProfileDialog({
  isOpen,
  onOpenChange,
  applicant,
  onViewCV,
  onDownloadCV
}: ApplicantProfileDialogProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "hired":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "interview":
        return "Entrevista"
      case "hired":
        return "Contratado"
      case "rejected":
        return "Rechazado"
      default:
        return status
    }
  }

  const handleViewCV = (cvUrl: string) => {
    if (onViewCV && applicant) {
      onViewCV(cvUrl, applicant.id);
    } else if (cvUrl) {
      // Fallback to default behavior
      const filename = cvUrl.split('/').pop();
      if (filename) {
        window.open(`/api/uploads/cvs/${filename}`, '_blank');
      }
    }
  }

  const handleDownloadCV = (cvUrl: string, applicantName: string) => {
    if (onDownloadCV && applicant) {
      onDownloadCV(cvUrl, applicantName, applicant.id);
    } else if (cvUrl) {
      // Fallback to default behavior
      const filename = cvUrl.split('/').pop();
      if (filename) {
        const link = document.createElement('a');
        link.href = `/api/uploads/cvs/${filename}`;
        link.download = `CV_${applicantName || 'Candidato'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={applicant.image || "/placeholder.svg"} />
              <AvatarFallback>
                {applicant.name
                  ? applicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{applicant.name || "Sin nombre"}</h3>
              <p className="text-sm text-muted-foreground">{applicant.position}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Información completa del candidato
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Información de Contacto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{applicant.email || "Sin email"}</span>
              </div>
              {applicant.career && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{applicant.career}</span>
                </div>
              )}
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Detalles de Postulación
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fecha de postulación</p>
                <p className="font-medium">{formatDate(applicant.appliedDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado actual</p>
                <Badge className={getStatusColor(applicant.status)}>
                  {getStatusLabel(applicant.status)}
                </Badge>
              </div>
              {applicant.hiredAt && (
                <div>
                  <p className="text-muted-foreground">Fecha de contratación</p>
                  <p className="font-medium">{formatDate(applicant.hiredAt)}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">CV revisado</p>
                <p className="font-medium">{applicant.cvViewed ? "Sí" : "No"}</p>
              </div>
            </div>
          </div>

          {/* CV Section */}
          {applicant.cvUrl && (
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Currículum Vitae
              </h4>
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleViewCV(applicant.cvUrl!)}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver CV
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDownloadCV(applicant.cvUrl!, applicant.name || 'Candidato')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar CV
                </Button>
              </div>
            </div>
          )}

          {/* Contact Actions */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Acciones de Contacto
            </h4>
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  if (applicant.email) {
                    window.open(`mailto:${applicant.email}?subject=Oportunidad laboral - ${applicant.position}`, '_blank');
                  }
                }}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Enviar Email
              </Button>
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}