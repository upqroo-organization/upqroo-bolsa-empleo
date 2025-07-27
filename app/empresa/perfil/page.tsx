"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Upload, Save, Mail, Users, CheckCircle, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Company {
  id: string
  name: string
  email: string
  description: string | null
  logoUrl: string | null
  websiteUrl: string | null
  rfc: string | null
  city: string | null
  country: string | null
  address: string | null
  zipCode: string | null
  phone: string | null
  fundationDate: string | null
  industry: string | null
  organizationCulture: string | null
  size: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  contactPosition: string | null
  companyRole: string | null
  stateId: number | null
  state: {
    id: number
    name: string
  } | null
  isApprove: boolean
  approvalStatus: string
  createdAt: string
  updatedAt: string
}

interface State {
  id: number
  name: string
}

export default function CompanyProfile() {
  const [company, setCompany] = useState<Company | null>(null)
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [formData, setFormData] = useState<Partial<Company>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchCompanyData()
    fetchStates()
  }, [])

  const fetchCompanyData = async () => {
    try {
      const response = await fetch('/api/company/me')
      const result = await response.json()
      
      if (result.success) {
        setCompany(result.data)
        setFormData(result.data)
      } else {
        toast.error('Error al cargar los datos de la empresa')
      }
    } catch (error) {
      toast.error('Error al cargar los datos de la empresa')
      console.debug(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/states')
      const data = await response.json()
      setStates(data)
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const handleInputChange = (field: keyof Company, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/company/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setCompany(result.data)
        setFormData(result.data)
        toast.success('Perfil actualizado exitosamente')
      } else {
        toast.error(result.error || 'Error al actualizar el perfil')
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil')
      console.debug(error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos de imagen (JPG, PNG, WebP, SVG)')
      return
    }

    // Validate file size (1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 1MB para logos')
      return
    }

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await fetch('/api/company/logo', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setCompany(result.data)
        setFormData(result.data)
        toast.success('Logo subido correctamente')
      } else {
        toast.error(result.error || 'Error al subir el logo')
      }
    } catch (error) {
      toast.error('Error al subir el logo')
      console.debug(error)
    } finally {
      setUploadingLogo(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleLogoDelete = async () => {
    if (!company?.logoUrl) return

    setUploadingLogo(true)
    try {
      const response = await fetch('/api/company/logo', {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setCompany(result.data)
        setFormData(result.data)
        toast.success('Logo eliminado correctamente')
      } else {
        toast.error(result.error || 'Error al eliminar el logo')
      }
    } catch (error) {
      toast.error('Error al eliminar el logo')
      console.debug(error)
    } finally {
      setUploadingLogo(false)
    }
  }

  const calculateCompletionPercentage = () => {
    if (!company) return 0
    
    const fields = [
      company.name,
      company.description,
      company.rfc,
      company.phone,
      company.address,
      company.city,
      company.contactName,
      company.contactEmail,
      company.industry,
      company.size
    ]
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length
    return Math.round((filledFields / fields.length) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Alert>
          <AlertDescription>
            No se pudo cargar la información de la empresa.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
  const completionPercentage = calculateCompletionPercentage()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Perfil de Empresa</h1>
          <p className="text-muted-foreground">Gestiona la información de tu empresa</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Perfil completado</p>
            <p className="text-2xl font-bold text-green-600">{completionPercentage}%</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Profile Completion Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Estado de aprobación:</strong> {company.approvalStatus === 'approved' ? 'Aprobada' : company.approvalStatus === 'pending' ? 'Pendiente de aprobación' : 'Rechazada'}
          {completionPercentage < 100 && ' - Completa tu perfil para mejorar tu visibilidad.'}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Básico
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contacto
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Detalles
          </TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información Básica
              </CardTitle>
              <CardDescription>Datos principales de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-primary/20">
                    {formData.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/${formData.logoUrl}`} alt="Logo de la empresa" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="h-16 w-16 text-primary" />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingLogo}
                      >
                        {uploadingLogo ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        {formData.logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                      </Button>
                      {formData.logoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleLogoDelete}
                          disabled={uploadingLogo}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP, SVG. Max 1MB</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                      <Input 
                        id="companyName" 
                        value={formData.name || ''} 
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rfc">RFC</Label>
                      <Input 
                        id="rfc" 
                        value={formData.rfc || ''} 
                        onChange={(e) => handleInputChange('rfc', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Sector Industrial</Label>
                      <Select 
                        value={formData.industry || ''} 
                        onValueChange={(value) => handleInputChange('industry', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Tecnología</SelectItem>
                          <SelectItem value="tourism">Turismo</SelectItem>
                          <SelectItem value="manufacturing">Manufactura</SelectItem>
                          <SelectItem value="services">Servicios</SelectItem>
                          <SelectItem value="retail">Comercio</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Tamaño de la Empresa</Label>
                      <Select 
                        value={formData.size || ''} 
                        onValueChange={(value) => handleInputChange('size', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Startup (1-10)">Startup (1-10)</SelectItem>
                          <SelectItem value="Pequeña (11-50)">Pequeña (11-50)</SelectItem>
                          <SelectItem value="Mediana (51-200)">Mediana (51-200)</SelectItem>
                          <SelectItem value="Grande (201-1000)">Grande (201-1000)</SelectItem>
                          <SelectItem value="Corporativo (1000+)">Corporativo (1000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Sitio Web</Label>
                    <Input 
                      id="websiteUrl" 
                      type="url"
                      value={formData.websiteUrl || ''} 
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://www.ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción de la Empresa</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe tu empresa, sus servicios y lo que la hace única..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationCulture">Cultura Organizacional</Label>
                <Textarea
                  id="organizationCulture"
                  rows={3}
                  value={formData.organizationCulture || ''}
                  onChange={(e) => handleInputChange('organizationCulture', e.target.value)}
                  placeholder="Describe la cultura y valores de tu empresa..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundationDate">Fecha de Fundación</Label>
                <Input 
                  id="fundationDate" 
                  type="date"
                  value={formData.fundationDate ? new Date(formData.fundationDate).toISOString().split('T')[0] : ''} 
                  onChange={(e) => handleInputChange('fundationDate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>Datos de contacto y ubicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico Principal *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={company.email} 
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono Principal</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone || ''} 
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(999) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección Completa</Label>
                <Textarea
                  id="address"
                  rows={3}
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Calle, número, colonia, referencias..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input 
                    id="city" 
                    value={formData.city || ''} 
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Ciudad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select 
                    value={formData.stateId?.toString() || ''} 
                    onValueChange={(value) => handleInputChange('stateId', value ? parseInt(value) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input 
                    id="country" 
                    value={formData.country || ''} 
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="México"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Código Postal</Label>
                  <Input 
                    id="zipCode" 
                    value={formData.zipCode || ''} 
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="77500"
                  />
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Persona de Contacto</CardTitle>
                  <CardDescription>Información del contacto principal para reclutamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Nombre Completo</Label>
                      <Input 
                        id="contactName" 
                        value={formData.contactName || ''} 
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="Nombre del contacto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPosition">Cargo</Label>
                      <Input 
                        id="contactPosition" 
                        value={formData.contactPosition || ''} 
                        onChange={(e) => handleInputChange('contactPosition', e.target.value)}
                        placeholder="Gerente de Recursos Humanos"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Correo Electrónico</Label>
                      <Input 
                        id="contactEmail" 
                        type="email" 
                        value={formData.contactEmail || ''} 
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="contacto@empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Teléfono Directo</Label>
                      <Input 
                        id="contactPhone" 
                        value={formData.contactPhone || ''} 
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="(999) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyRole">Rol en la Empresa</Label>
                    <Input 
                      id="companyRole" 
                      value={formData.companyRole || ''} 
                      onChange={(e) => handleInputChange('companyRole', e.target.value)}
                      placeholder="Descripción del rol"
                    />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Details */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Estado de Aprobación
              </CardTitle>
              <CardDescription>Información sobre el estado de tu empresa en la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado de Aprobación</Label>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        company.approvalStatus === 'approved' ? 'bg-green-500' :
                        company.approvalStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">
                        {company.approvalStatus === 'approved' ? 'Aprobada' :
                         company.approvalStatus === 'pending' ? 'Pendiente' : 'Rechazada'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {company.approvalStatus === 'approved' 
                        ? 'Tu empresa está aprobada para publicar vacantes'
                        : company.approvalStatus === 'pending'
                        ? 'Tu empresa está siendo revisada por un coordinador'
                        : 'Tu empresa ha sido rechazada. Contacta al coordinador para más información'
                      }
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Registro</Label>
                  <div className="p-3 border rounded-lg">
                    <span className="font-medium">
                      {new Date(company.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {company.approvalStatus === 'pending' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Información importante:</strong> Mientras tu empresa esté pendiente de aprobación, 
                    no podrás publicar vacantes. Un coordinador revisará tu información pronto.
                  </AlertDescription>
                </Alert>
              )}

              {company.approvalStatus === 'approved' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>¡Felicidades!</strong> Tu empresa está aprobada. Ya puedes publicar vacantes 
                    y gestionar postulantes en la plataforma.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button 
          variant="outline" 
          onClick={() => {
            setFormData(company)
            toast.info('Cambios descartados')
          }}
        >
          Descartar Cambios
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}
