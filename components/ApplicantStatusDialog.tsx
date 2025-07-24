"use client";

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"

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

interface ApplicantStatusDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  applicant: ApplicantData | null
  onStatusUpdate: (applicationId: string, newStatus: string) => void
}

export default function ApplicantStatusDialog({
  isOpen,
  onOpenChange,
  applicant,
  onStatusUpdate
}: ApplicantStatusDialogProps) {
  const [statusLoading, setStatusLoading] = useState(false);

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

  const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'bg-blue-100 text-blue-800' },
    { value: 'interview', label: 'En entrevista', color: 'bg-purple-100 text-purple-800' },
    { value: 'rejected', label: 'Rechazado', color: 'bg-red-100 text-red-800' },
    { value: 'hired', label: 'Contratado', color: 'bg-green-100 text-green-800' },
  ];

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    setStatusLoading(true);
    try {
      const response = await fetch(`/api/empresa/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        onStatusUpdate(applicationId, newStatus);
        toast.success(data.message || 'Estado actualizado correctamente');
        onOpenChange(false);
      } else {
        toast.error(data.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar estado');
    } finally {
      setStatusLoading(false);
    }
  }

  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Estado del Postulante</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo estado para {applicant.name || "este postulante"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
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
              <p className="font-medium">{applicant.name || "Sin nombre"}</p>
              <p className="text-sm text-muted-foreground">{applicant.position}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Estado actual:</p>
            <Badge className={getStatusColor(applicant.status)}>
              {getStatusLabel(applicant.status)}
            </Badge>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Nuevo estado:</p>
            <Select
              defaultValue={applicant.status}
              onValueChange={(value) => updateApplicationStatus(applicant.id, value)}
              disabled={statusLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={statusLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}