"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Mail,
  Users,
  Eye,
  Send,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  UserPlus
} from "lucide-react"

interface Company {
  id: string
  name: string
  email: string
  contactName: string | null
  industry: string | null
  state: {
    name: string
  } | null
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  description: string
  variables: string[]
  content: string
}

interface EmailCampaignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailCampaignModal({ open, onOpenChange }: EmailCampaignModalProps) {
  const [activeTab, setActiveTab] = useState("compose")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  // Companies data
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [companyFilter, setCompanyFilter] = useState("")

  // Custom emails data
  const [customEmails, setCustomEmails] = useState<Array<{ email: string; name: string }>>([])
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")

  // Templates data
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("none")

  // Email composition
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    templateData: {} as Record<string, string>
  })

  // Preview and results
  const [previewData, setPreviewData] = useState<{
    subject: string
    content: string
    recipient: Company | null
  } | null>(null)

  const [sendResults, setSendResults] = useState<{
    totalCompanies: number
    totalCustomEmails: number
    sent: number
    failed: number
    errors: string[]
  } | null>(null)

  // Load companies and templates when modal opens
  useEffect(() => {
    if (open) {
      loadCompanies()
      loadTemplates()
    }
  }, [open])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/coordinador/email-campaigns")
      const result = await response.json()

      if (result.success) {
        setCompanies(result.data.companies)
        setSelectedCompanies(result.data.companies.map((c: Company) => c.id))
      } else {
        toast.error("Error al cargar empresas")
      }
    } catch (error) {
      console.error("Error loading companies:", error)
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch("/api/coordinador/email-templates")
      const result = await response.json()

      if (result.success) {
        setTemplates(result.data)
      }
    } catch (error) {
      console.error("Error loading templates:", error)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "none") {
      setSelectedTemplate("none")
      setEmailData(prev => ({
        ...prev,
        subject: "",
        message: "",
        templateData: {}
      }))
      return
    }

    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        message: template.content,
        templateData: {}
      }))
    }
  }

  const handleCompanyToggle = (companyId: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  const handleSelectAll = () => {
    const filteredCompanies = getFilteredCompanies()
    const allSelected = filteredCompanies.every(c => selectedCompanies.includes(c.id))

    if (allSelected) {
      setSelectedCompanies(prev => prev.filter(id => !filteredCompanies.map(c => c.id).includes(id)))
    } else {
      setSelectedCompanies(prev => [...new Set([...prev, ...filteredCompanies.map(c => c.id)])])
    }
  }

  const getFilteredCompanies = () => {
    return companies.filter(company =>
      company.name.toLowerCase().includes(companyFilter.toLowerCase()) ||
      company.email.toLowerCase().includes(companyFilter.toLowerCase()) ||
      (company.industry && company.industry.toLowerCase().includes(companyFilter.toLowerCase()))
    )
  }

  const addCustomEmail = () => {
    if (!newEmail || !newName) {
      toast.error("Complete el email y nombre")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast.error("Formato de email inválido")
      return
    }

    // Check if email already exists
    if (customEmails.some(e => e.email === newEmail)) {
      toast.error("Este email ya está agregado")
      return
    }

    setCustomEmails(prev => [...prev, { email: newEmail, name: newName }])
    setNewEmail("")
    setNewName("")
    toast.success("Email agregado correctamente")
  }

  const removeCustomEmail = (emailToRemove: string) => {
    setCustomEmails(prev => prev.filter(e => e.email !== emailToRemove))
  }

  const generatePreview = () => {
    if (!emailData.subject || !emailData.message || (selectedCompanies.length === 0 && customEmails.length === 0)) {
      toast.error("Complete todos los campos requeridos y seleccione al menos un destinatario")
      return
    }

    // Use company for preview if available, otherwise use first custom email
    const sampleCompany = companies.find(c => selectedCompanies.includes(c.id))
    if (!sampleCompany && customEmails.length === 0) return

    let previewContent = emailData.message
    let previewSubject = emailData.subject

    // Replace template variables
    if (selectedTemplate && selectedTemplate !== "none") {
      const template = templates.find(t => t.id === selectedTemplate)
      if (template) {
        template.variables.forEach(variable => {
          const value = emailData.templateData[variable] || `[${variable}]`
          previewContent = previewContent.replace(new RegExp(`{{${variable}}}`, 'g'), value)
          previewSubject = previewSubject.replace(new RegExp(`{{${variable}}}`, 'g'), value)
        })
      }
    }

    // Replace company-specific variables
    if (sampleCompany) {
      previewContent = previewContent.replace(/{{companyName}}/g, sampleCompany.name)
      previewContent = previewContent.replace(/{{contactName}}/g, sampleCompany.contactName || 'Estimado/a')
    } else {
      // For custom emails, use generic placeholders
      previewContent = previewContent.replace(/{{companyName}}/g, customEmails[0]?.name || 'Empresa')
      previewContent = previewContent.replace(/{{contactName}}/g, 'Estimado/a')
    }

    setPreviewData({
      subject: previewSubject,
      content: previewContent,
      recipient: sampleCompany || {
        id: 'custom',
        name: customEmails[0]?.name || 'Email personalizado',
        email: customEmails[0]?.email || '',
        contactName: customEmails[0]?.name || null,
        industry: null,
        state: null
      }
    })
    setActiveTab("preview")
  }

  const handleSendEmails = async () => {
    if (!emailData.subject || !emailData.message || (selectedCompanies.length === 0 && customEmails.length === 0)) {
      toast.error("Complete todos los campos requeridos y seleccione al menos un destinatario")
      return
    }

    try {
      setSending(true)
      const response = await fetch("/api/coordinador/email-campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject: emailData.subject,
          message: emailData.message,
          template: selectedTemplate !== "none" ? selectedTemplate : null,
          templateData: emailData.templateData,
          companyIds: selectedCompanies,
          customEmails: customEmails
        })
      })

      const result = await response.json()

      if (result.success) {
        setSendResults(result.data)
        setActiveTab("results")
        const totalRecipients = result.data.totalCompanies + result.data.totalCustomEmails
        toast.success(`Correos enviados: ${result.data.sent}/${totalRecipients}`)
      } else {
        toast.error(result.error || "Error al enviar correos")
      }
    } catch (error) {
      console.error("Error sending emails:", error)
      toast.error("Error de conexión")
    } finally {
      setSending(false)
    }
  }

  const resetModal = () => {
    setActiveTab("compose")
    setSelectedTemplate("none")
    setEmailData({ subject: "", message: "", templateData: {} })
    setPreviewData(null)
    setSendResults(null)
    setCompanyFilter("")
    setCustomEmails([])
    setNewEmail("")
    setNewName("")
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  const filteredCompanies = getFilteredCompanies()
  const selectedCount = selectedCompanies.length
  const totalRecipients = selectedCount + customEmails.length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Campaña de Correo Masivo
          </DialogTitle>
          <DialogDescription>
            Envía correos personalizados a todas las empresas registradas
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compose">Redactar</TabsTrigger>
            <TabsTrigger value="recipients">Destinatarios</TabsTrigger>
            <TabsTrigger value="preview" disabled={!previewData}>Vista Previa</TabsTrigger>
            <TabsTrigger value="results" disabled={!sendResults}>Resultados</TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <TabsContent value="compose" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plantillas</CardTitle>
                    <CardDescription>Selecciona una plantilla predefinida</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plantilla..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin plantilla</SelectItem>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedTemplate && selectedTemplate !== "none" && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {templates.find(t => t.id === selectedTemplate)?.description}
                        </p>

                        {templates.find(t => t.id === selectedTemplate)?.variables.map(variable => (
                          <div key={variable}>
                            <Label htmlFor={variable} className="text-sm">
                              {variable.charAt(0).toUpperCase() + variable.slice(1)}
                            </Label>
                            <Input
                              id={variable}
                              value={emailData.templateData[variable] || ""}
                              onChange={(e) => setEmailData(prev => ({
                                ...prev,
                                templateData: {
                                  ...prev.templateData,
                                  [variable]: e.target.value
                                }
                              }))}
                              placeholder={`Ingrese ${variable}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Composición</CardTitle>
                    <CardDescription>Redacta tu mensaje personalizado</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Asunto</Label>
                      <Input
                        id="subject"
                        value={emailData.subject}
                        onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Asunto del correo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensaje</Label>
                      <Textarea
                        id="message"
                        value={emailData.message}
                        onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Escribe tu mensaje aquí..."
                        rows={8}
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Companies Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Empresas Registradas
                    </CardTitle>
                    <CardDescription>
                      {selectedCount} de {companies.length} empresas seleccionadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Buscar empresas..."
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm" onClick={handleSelectAll}>
                        {filteredCompanies.every(c => selectedCompanies.includes(c.id)) ? "Deseleccionar" : "Seleccionar"} Todo
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : (
                        filteredCompanies.map(company => (
                          <div key={company.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              checked={selectedCompanies.includes(company.id)}
                              onCheckedChange={() => handleCompanyToggle(company.id)}
                            />
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{company.name}</p>
                              <p className="text-sm text-muted-foreground">{company.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {company.industry && (
                                  <Badge variant="secondary" className="text-xs">
                                    {company.industry}
                                  </Badge>
                                )}
                                {company.state && (
                                  <Badge variant="outline" className="text-xs">
                                    {company.state.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Emails Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Emails Personalizados
                    </CardTitle>
                    <CardDescription>
                      {customEmails.length} emails personalizados agregados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add new email form */}
                    <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                      <div className="grid grid-cols-1 gap-2">
                        <Input
                          placeholder="Nombre del contacto"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                        <Input
                          placeholder="email@ejemplo.com"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={addCustomEmail}
                        size="sm"
                        className="w-full"
                        disabled={!newEmail || !newName}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Email
                      </Button>
                    </div>

                    {/* Custom emails list */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {customEmails.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No hay emails personalizados agregados</p>
                        </div>
                      ) : (
                        customEmails.map((customEmail, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{customEmail.name}</p>
                              <p className="text-sm text-muted-foreground">{customEmail.email}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomEmail(customEmail.email)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {previewData && (
                <div className="space-y-4">
                  {/* Email Client Header */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Vista Previa del Correo
                      </CardTitle>
                      <CardDescription>
                        Así verá el correo: {previewData.recipient?.name} ({previewData.recipient?.email})
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Email Preview Container */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
                      {/* Email Header */}
                      <div className="border-b bg-gray-50 px-6 py-4 rounded-t-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <Mail className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Universidad Politécnica de Quintana Roo</p>
                              <p className="text-xs text-muted-foreground">coordinacion@upqroo.edu.mx</p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString('es-MX', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Para:</span>
                            <span>{previewData.recipient?.contactName || 'Estimado/a'} &lt;{previewData.recipient?.email}&gt;</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Asunto:</span>
                            <span className="font-medium">{previewData.subject}</span>
                          </div>
                        </div>
                      </div>

                      {/* Email Body */}
                      <div className="px-6 py-6">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {previewData.content}
                          </div>
                        </div>
                      </div>

                      {/* Email Footer */}
                      <div className="border-t bg-gray-50 px-6 py-4 rounded-b-lg">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p className="font-medium">Universidad Politécnica de Quintana Roo</p>
                          <p>Coordinación de Vinculación Empresarial</p>
                          <p>Av. Arco Bicentenario, Mza. 1, Lote 1, Sm. 255, Cancún, Q.R.</p>
                          <p>Tel: (998) 000-0000 | coordinacion@upqroo.edu.mx</p>
                          <div className="pt-2 border-t mt-3">
                            <p className="text-xs">
                              Este correo fue enviado desde la plataforma de Bolsa de Trabajo Universitaria de UPQROO.
                              Si no desea recibir más correos de este tipo, puede contactarnos para darse de baja.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Controls */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Información del destinatario de ejemplo:</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Empresa: {previewData.recipient?.name}</p>
                            <p>• Contacto: {previewData.recipient?.contactName || 'No especificado'}</p>
                            <p>• Email: {previewData.recipient?.email}</p>
                            {previewData.recipient?.industry && (
                              <p>• Industria: {previewData.recipient.industry}</p>
                            )}
                            {previewData.recipient?.state && (
                              <p>• Estado: {previewData.recipient.state.name}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab("compose")}
                          >
                            Editar
                          </Button>
                          <Select
                            value={previewData.recipient?.id || ""}
                            onValueChange={(companyId) => {
                              const newRecipient = companies.find(c => c.id === companyId && selectedCompanies.includes(c.id))
                              if (newRecipient) {
                                // Regenerate preview with new recipient
                                let previewContent = emailData.message
                                let previewSubject = emailData.subject

                                // Replace template variables
                                if (selectedTemplate && selectedTemplate !== "none") {
                                  const template = templates.find(t => t.id === selectedTemplate)
                                  if (template) {
                                    template.variables.forEach(variable => {
                                      const value = emailData.templateData[variable] || `[${variable}]`
                                      previewContent = previewContent.replace(new RegExp(`{{${variable}}}`, 'g'), value)
                                      previewSubject = previewSubject.replace(new RegExp(`{{${variable}}}`, 'g'), value)
                                    })
                                  }
                                }

                                // Replace company-specific variables
                                previewContent = previewContent.replace(/{{companyName}}/g, newRecipient.name)
                                previewContent = previewContent.replace(/{{contactName}}/g, newRecipient.contactName || 'Estimado/a')

                                setPreviewData({
                                  subject: previewSubject,
                                  content: previewContent,
                                  recipient: newRecipient
                                })
                              }
                            }}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Cambiar empresa ejemplo" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.filter(c => selectedCompanies.includes(c.id)).map(company => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {sendResults && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">{sendResults.sent}</p>
                        <p className="text-sm text-muted-foreground">Enviados</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-600">{sendResults.failed}</p>
                        <p className="text-sm text-muted-foreground">Fallidos</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{sendResults.totalCompanies}</p>
                        <p className="text-sm text-muted-foreground">Empresas</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">{sendResults.totalCustomEmails}</p>
                        <p className="text-sm text-muted-foreground">Emails personalizados</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resumen del Envío</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total de destinatarios:</span>
                          <span className="font-medium">{sendResults.totalCompanies + sendResults.totalCustomEmails}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Correos enviados exitosamente:</span>
                          <span className="font-medium text-green-600">{sendResults.sent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Correos fallidos:</span>
                          <span className="font-medium text-red-600">{sendResults.failed}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Tasa de éxito:</span>
                          <span className="font-medium">
                            {Math.round((sendResults.sent / (sendResults.totalCompanies + sendResults.totalCustomEmails)) * 100)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {sendResults.errors.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Errores</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {sendResults.errors.map((error, index) => (
                            <p key={index} className="text-sm text-red-600">• {error}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {selectedCount} empresas
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {customEmails.length} emails personalizados
            </div>
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Users className="h-4 w-4" />
              {totalRecipients} total
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>

            {activeTab === "compose" && (
              <Button onClick={generatePreview} disabled={!emailData.subject || !emailData.message}>
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
            )}

            {activeTab === "preview" && (
              <Button onClick={handleSendEmails} disabled={sending || totalRecipients === 0}>
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {sending ? "Enviando..." : `Enviar a ${totalRecipients} destinatarios`}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}