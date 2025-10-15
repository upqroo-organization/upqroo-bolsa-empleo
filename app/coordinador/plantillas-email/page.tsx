"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Mail,
  Eye,
  ArrowLeft,
  FileText,
  Settings,
} from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  description: string
  variables: string[]
  content: string
}

export default function EmailTemplatesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [previewDialog, setPreviewDialog] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      if (session.user.role !== 'coordinator') {
        router.push("/")
        return
      }
      loadTemplates()
    }
  }, [status, router, session])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/coordinador/email-templates")
      const result = await response.json()

      if (result.success) {
        setTemplates(result.data)
      } else {
        toast.error("Error al cargar plantillas")
      }
    } catch (error) {
      console.error("Error loading templates:", error)
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setPreviewDialog(true)
  }

  const getPreviewContent = (template: EmailTemplate) => {
    let content = template.content
    let subject = template.subject

    // Replace variables with sample data
    const sampleData: Record<string, string> = {
      eventDate: "15 de Noviembre, 2024",
      eventLocation: "Auditorio Principal UPQROO",
      registrationDeadline: "10 de Noviembre, 2024",
      contactEmail: "coordinacion@upqroo.edu.mx",
      studentName: "Juan Pérez García",
      position: "Desarrollador Frontend",
      hireDate: "1 de Octubre, 2024",
      surveyLink: "https://upqroo.edu.mx/encuesta/123",
      partnershipType: "Convenio de Prácticas Profesionales",
      benefits: "• Acceso a talento universitario\n• Participación en ferias de empleo\n• Colaboración en proyectos de investigación",
      nextSteps: "• Reunión de coordinación\n• Firma de convenio\n• Inicio de colaboración",
      month: "Octubre 2024",
      highlights: "• 25 nuevas empresas registradas\n• 150 vacantes publicadas\n• 80 estudiantes colocados",
      statistics: "• Total estudiantes: 1,250\n• Empresas activas: 85\n• Tasa de colocación: 78%",
      upcomingEvents: "• Feria de Empleo - 15 Nov\n• Taller de CV - 20 Nov\n• Conferencia Empresarial - 25 Nov",
      reminderType: "Evaluación de Desempeño",
      details: "Recordatorio para completar la evaluación del estudiante contratado",
      deadline: "30 de Noviembre, 2024",
      action: "Completar encuesta de evaluación"
    }

    template.variables.forEach(variable => {
      const value = sampleData[variable] || `[${variable}]`
      content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value)
      subject = subject.replace(new RegExp(`{{${variable}}}`, 'g'), value)
    })

    // Replace company variables
    content = content.replace(/{{companyName}}/g, "Empresa Ejemplo S.A.")
    content = content.replace(/{{contactName}}/g, "María González")

    return { subject, content }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Plantillas de Correo</h1>
          <p className="text-muted-foreground">
            Gestiona las plantillas predefinidas para campañas de correo masivo
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Asunto:</p>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  {template.subject}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Variables disponibles:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Vista Previa: {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Ejemplo con datos de muestra
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-sm font-medium mb-2">Asunto:</p>
                <div className="bg-muted p-3 rounded text-sm">
                  {getPreviewContent(selectedTemplate).subject}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Contenido:</p>
                <div className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                  Estimado/a María González,

                  {getPreviewContent(selectedTemplate).content}

                  Saludos cordiales,
                  Equipo de Coordinación
                  Universidad Politécnica de Quintana Roo
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Variables utilizadas:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {templates.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No hay plantillas disponibles</h3>
            <p className="text-muted-foreground mb-4">
              Las plantillas de correo aparecerán aquí cuando estén configuradas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}