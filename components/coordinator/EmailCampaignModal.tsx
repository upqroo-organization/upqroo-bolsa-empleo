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
  Send,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  UserPlus,
  FileText,
  PenLine,
  Eye,
  List
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
  isExternal?: boolean
}

interface EmailCampaignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailCampaignModal({ open, onOpenChange }: EmailCampaignModalProps) {
  const [activeTab, setActiveTab] = useState("compose")
  const [loading, setLoading] = useState(false)
  const [emailType, setEmailType] = useState<'template' | 'custom'>('template')
  const [sending, setSending] = useState(false)

  // Companies data
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [companyFilter, setCompanyFilter] = useState("")
  const [internalCount, setInternalCount] = useState(0)
  const [externalCount, setExternalCount] = useState(0)

  // Custom emails data
  const [customEmails, setCustomEmails] = useState<Array<{ email: string; name: string }>>([])
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkEmails, setBulkEmails] = useState("")

  // Email composition - simplified for single template
  const [emailData, setEmailData] = useState({
    companyName: "",
    contactName: ""
  })

  // Custom email fields
  const [customSubject, setCustomSubject] = useState("")
  const [customBody, setCustomBody] = useState("")

  const [sendResults, setSendResults] = useState<{
    totalCompanies: number
    totalCustomEmails: number
    sent: number
    failed: number
    errors: string[]
  } | null>(null)

  // Load companies when modal opens
  useEffect(() => {
    if (open) {
      loadCompanies()
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
        setInternalCount(result.data.internalCount || 0)
        setExternalCount(result.data.externalCount || 0)
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
      company.name?.toLowerCase().includes(companyFilter.toLowerCase()) ||
      (company.email && company.email.toLowerCase().includes(companyFilter.toLowerCase())) ||
      (company.industry && company.industry.toLowerCase().includes(companyFilter.toLowerCase()))
    )
  }

  const addCustomEmail = () => {
    if (!newEmail) {
      toast.error("Ingrese un email")
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

    setCustomEmails(prev => [...prev, { email: newEmail, name: newName || '' }])
    setNewEmail("")
    setNewName("")
    toast.success("Email agregado correctamente")
  }

  const addBulkEmails = () => {
    if (!bulkEmails.trim()) {
      toast.error("Pegue al menos un email")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Split by commas, semicolons, newlines or spaces
    const emails = bulkEmails
      .split(/[,;\n\s]+/)
      .map(e => e.trim())
      .filter(Boolean)

    let added = 0
    let skipped = 0
    const newEmails = [...customEmails]

    for (const email of emails) {
      if (!emailRegex.test(email)) {
        skipped++
        continue
      }
      if (newEmails.some(e => e.email === email)) {
        skipped++
        continue
      }
      newEmails.push({ email, name: '' })
      added++
    }

    setCustomEmails(newEmails)
    setBulkEmails("")
    setBulkMode(false)

    if (added > 0) {
      toast.success(`${added} email(s) agregado(s)${skipped > 0 ? `, ${skipped} omitido(s)` : ''}`)
    } else {
      toast.error("No se encontraron emails válidos nuevos")
    }
  }

  const removeCustomEmail = (emailToRemove: string) => {
    setCustomEmails(prev => prev.filter(e => e.email !== emailToRemove))
  }



  const handleSendEmails = async () => {
    if ((selectedCompanies.length === 0 && customEmails.length === 0)) {
      toast.error("Seleccione al menos un destinatario")
      return
    }

    if (emailType === 'custom' && (!customSubject.trim() || !customBody.trim())) {
      toast.error("Complete el asunto y el cuerpo del correo personalizado")
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
          companyIds: selectedCompanies,
          customEmails: customEmails,
          templateData: emailData,
          emailType,
          customSubject: customSubject.trim(),
          customBody: customBody.trim()
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
    setEmailData({ companyName: "", contactName: "" })
    setSendResults(null)
    setCompanyFilter("")
    setCustomEmails([])
    setNewEmail("")
    setNewName("")
    setInternalCount(0)
    setExternalCount(0)
    setEmailType('template')
    setCustomSubject("")
    setCustomBody("")
    setBulkMode(false)
    setBulkEmails("")
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Configurar</TabsTrigger>
            <TabsTrigger value="recipients">Destinatarios</TabsTrigger>
            <TabsTrigger value="results" disabled={!sendResults}>Resultados</TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <TabsContent value="compose" className="space-y-4">
              {/* Email Type Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEmailType('template')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${emailType === 'template'
                    ? 'border-[#622120] bg-[#622120]/5 shadow-sm'
                    : 'border-border hover:border-muted-foreground/30'
                    }`}
                >
                  <FileText className={`h-5 w-5 ${emailType === 'template' ? 'text-[#622120]' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className={`font-medium text-sm ${emailType === 'template' ? 'text-[#622120]' : ''}`}>Plantilla Predeterminada</p>
                    <p className="text-xs text-muted-foreground">Invitación a registro</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setEmailType('custom')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${emailType === 'custom'
                    ? 'border-[#622120] bg-[#622120]/5 shadow-sm'
                    : 'border-border hover:border-muted-foreground/30'
                    }`}
                >
                  <PenLine className={`h-5 w-5 ${emailType === 'custom' ? 'text-[#622120]' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className={`font-medium text-sm ${emailType === 'custom' ? 'text-[#622120]' : ''}`}>Correo Personalizado</p>
                    <p className="text-xs text-muted-foreground">Redacta tu propio correo</p>
                  </div>
                </button>
              </div>

              {emailType === 'template' ? (
                /* Template Mode */
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plantilla de Invitación</CardTitle>
                    <CardDescription>
                      Se enviará automáticamente a cada destinatario con su nombre personalizado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">📧 Asunto del correo:</h4>
                      <p className="text-sm text-blue-800">
                        &quot;Invitación a registrarse en la Bolsa de Trabajo Universitaria de UPQROO&quot;
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Vista previa de la plantilla</span>
                      </div>
                      <div>
                        {/* Header Preview */}
                        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#622120' }}>
                          <span className="text-white font-bold text-sm">Bolsa de Trabajo</span>
                          <span className="text-white/70 text-xs">UPQROO</span>
                        </div>
                        {/* Body Preview */}
                        <div className="p-4 text-sm text-foreground leading-relaxed space-y-2">
                          <p>Estimado(a) <strong>[nombre del destinatario]</strong>,</p>
                          <p>La <strong>Universidad Politécnica de Quintana Roo</strong> te invita cordialmente a registrar tu empresa en la <strong>Bolsa de Trabajo Universitaria</strong>.</p>
                          <p className="text-muted-foreground text-xs mt-1">• Publicar ofertas de empleo y prácticas profesionales sin costo</p>
                          <p className="text-muted-foreground text-xs">• Acceder a perfiles de estudiantes y egresados</p>
                          <p className="text-muted-foreground text-xs">• Fortalecer la vinculación con la universidad</p>
                          <div className="text-center my-3">
                            <span className="inline-block px-4 py-2 text-xs text-white rounded-md" style={{ backgroundColor: '#622120' }}>
                              Registrarse gratuitamente
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Contacto: gestionempresarial@upqroo.edu.mx</p>
                        </div>
                        {/* Footer Preview */}
                        <div className="px-4 py-3 bg-muted/50 text-center">
                          <p className="text-xs text-muted-foreground">
                            Universidad Politécnica de Quintana Roo — Cancún, Quintana Roo
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Custom Email Mode */
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Redactar Correo Personalizado</CardTitle>
                    <CardDescription>
                      El correo se enviará con el header y footer oficiales de UPQROO
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="customSubject">Asunto del correo *</Label>
                      <Input
                        id="customSubject"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="Ej: Invitación a Feria de Empleo UPQROO 2026"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customBody">Cuerpo del correo *</Label>
                      <Textarea
                        id="customBody"
                        value={customBody}
                        onChange={(e) => setCustomBody(e.target.value)}
                        placeholder="Escriba aquí el contenido de su correo...&#10;&#10;Use doble salto de línea para separar párrafos."
                        rows={8}
                        className="resize-y"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        El saludo &quot;Estimado(a) [nombre]&quot; se agregará automáticamente al inicio.
                        Use doble salto de línea para separar párrafos.
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Vista previa</span>
                      </div>
                      <div>
                        {/* Header Preview */}
                        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#622120' }}>
                          <span className="text-white font-bold text-sm">Bolsa de Trabajo</span>
                          <span className="text-white/70 text-xs">UPQROO</span>
                        </div>
                        {/* Body Preview */}
                        <div className="p-4 text-sm text-foreground leading-relaxed space-y-2">
                          <p><strong>Asunto:</strong> {customSubject || <span className="text-muted-foreground italic">Sin asunto</span>}</p>
                          <hr className="my-2" />
                          <p>Estimado(a) <strong>[nombre del destinatario]</strong>,</p>
                          {customBody ? (
                            customBody.split('\n\n').filter(Boolean).map((p, i) => (
                              <p key={i}>{p}</p>
                            ))
                          ) : (
                            <p className="text-muted-foreground italic">El cuerpo del correo aparecerá aquí...</p>
                          )}
                        </div>
                        {/* Footer Preview */}
                        <div className="px-4 py-3 bg-muted/50 text-center">
                          <p className="text-xs text-muted-foreground">
                            Universidad Politécnica de Quintana Roo — Cancún, Quintana Roo
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(internalCount > 0 || externalCount > 0) && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Empresas disponibles:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <span>{internalCount} empresas registradas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span>{externalCount} empresas externas</span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recipients" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Companies Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Empresas Disponibles
                    </CardTitle>
                    <CardDescription>
                      {selectedCount} de {companies.length} empresas seleccionadas
                      <br />
                      <span className="text-xs">
                        {internalCount} registradas • {externalCount} externas
                      </span>
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
                            <Building2 className={`h-4 w-4 ${company.isExternal ? 'text-blue-600' : 'text-muted-foreground'}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{company.name}</p>
                                {company.isExternal && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    Externa
                                  </Badge>
                                )}
                              </div>
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
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5" />
                          Emails Adicionales
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {customEmails.length} email(s) agregado(s)
                        </CardDescription>
                      </div>
                      <Button
                        variant={bulkMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBulkMode(!bulkMode)}
                      >
                        <List className="h-4 w-4 mr-1" />
                        {bulkMode ? 'Individual' : 'Agregar varios'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bulkMode ? (
                      /* Bulk paste mode */
                      <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                        <Textarea
                          placeholder={"Pegue los correos aquí, separados por comas, punto y coma, espacios o saltos de línea.\n\nEjemplo:\nemail1@ejemplo.com, email2@empresa.com\nemail3@gmail.com"}
                          value={bulkEmails}
                          onChange={(e) => setBulkEmails(e.target.value)}
                          rows={5}
                          className="resize-y"
                        />
                        <p className="text-xs text-muted-foreground">
                          Se usará &quot;Estimado/a&quot; como saludo para estos contactos
                        </p>
                        <Button
                          onClick={addBulkEmails}
                          size="sm"
                          className="w-full"
                          disabled={!bulkEmails.trim()}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar todos los emails
                        </Button>
                      </div>
                    ) : (
                      /* Individual add mode */
                      <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                        <div className="grid grid-cols-1 gap-2">
                          <Input
                            placeholder="email@ejemplo.com *"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                          />
                          <Input
                            placeholder="Nombre del contacto (opcional)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={addCustomEmail}
                          size="sm"
                          className="w-full"
                          disabled={!newEmail}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Email
                        </Button>
                      </div>
                    )}

                    {/* Custom emails list */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {customEmails.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No hay emails adicionales agregados</p>
                        </div>
                      ) : (
                        customEmails.map((customEmail, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              {customEmail.name ? (
                                <>
                                  <p className="font-medium">{customEmail.name}</p>
                                  <p className="text-sm text-muted-foreground">{customEmail.email}</p>
                                </>
                              ) : (
                                <p className="font-medium">{customEmail.email}</p>
                              )}
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
          </div >
        </Tabs >

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
              <UserPlus className="h-4 w-4" />
              {totalRecipients} total
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>

            {(activeTab === "compose" || activeTab === "recipients") && (
              <Button
                onClick={handleSendEmails}
                disabled={sending || totalRecipients === 0 || (emailType === 'custom' && (!customSubject.trim() || !customBody.trim()))}
              >
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
      </DialogContent >
    </Dialog >
  )
}