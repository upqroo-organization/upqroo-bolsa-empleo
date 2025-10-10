"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  isExternal?: boolean
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
  const [internalCount, setInternalCount] = useState(0)
  const [externalCount, setExternalCount] = useState(0)

  // Custom emails data
  const [customEmails, setCustomEmails] = useState<Array<{ email: string; name: string }>>([])
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")

  // Email composition - simplified for single template
  const [emailData, setEmailData] = useState({
    companyName: "",
    contactName: ""
  })

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



  const handleSendEmails = async () => {
    if ((selectedCompanies.length === 0 && customEmails.length === 0)) {
      toast.error("Seleccione al menos un destinatario")
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
          templateData: emailData
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
          <TabsList className="grid w-full grid-cols-2">
            {/* <TabsTrigger value="compose">Configurar</TabsTrigger> */}
            <TabsTrigger value="recipients">Destinatarios</TabsTrigger>
            <TabsTrigger value="results" disabled={!sendResults}>Resultados</TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <TabsContent value="compose" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuración del Email</CardTitle>
                  <CardDescription>
                    Se enviará la plantilla de invitación a registro con los datos personalizados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Nombre de la empresa (opcional)</Label>
                      <Input
                        id="companyName"
                        value={emailData.companyName}
                        onChange={(e) => setEmailData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Ej: Empresa ABC (se usará el nombre registrado si se deja vacío)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Si se deja vacío, se usará el nombre de cada empresa registrada
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="contactName">Nombre del contacto (opcional)</Label>
                      <Input
                        id="contactName"
                        value={emailData.contactName}
                        onChange={(e) => setEmailData(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="Ej: Sr./Sra. García (se usará el contacto registrado si se deja vacío)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Si se deja vacío, se usará el contacto de cada empresa o &quot;Estimado/a&quot;
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Plantilla que se enviará:</h4>
                    <p className="text-sm text-blue-800">
                      &quot;Invitación a registrarse en la Bolsa de Trabajo Universitaria de UPQROO&quot;
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      La plantilla incluye información sobre los beneficios de registrarse,
                      enlace de registro y datos de contacto de la universidad.
                    </p>
                  </div>

                  {(internalCount > 0 || externalCount > 0) && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
                      <p className="text-xs text-gray-600 mt-2">
                        Las empresas externas provienen de la base de datos de empresas que ya trabajan con la universidad.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
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
              <UserPlus className="h-4 w-4" />
              {totalRecipients} total
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>

            {(activeTab === "compose" || activeTab === "recipients") && (
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