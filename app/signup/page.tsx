"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chrome, Building2, FileText, Upload, Trash2, CheckCircle } from "lucide-react"
import LogoUpqroo from "@/assets/logo_upqroo.svg"
import StateSelect from "@/components/StateSelector"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRef } from "react"

export default function RegisterPage() {
  const router = useRouter()
  const fiscalInputRef = useRef<HTMLInputElement>(null)

  const [empresa, setCompanyData] = useState({
    nombre: "",
    rfc: "",
    email: "",
    telefono: "",
    sector: "",
    direccion: "",
    descripcion: "",
    contactoNombre: "",
    contactoPuesto: "",
    password: "",
    confirmPassword: "",
    state: undefined
  })

  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  
  // Fiscal document state
  const [fiscalDocument, setFiscalDocument] = useState<File | null>(null)
  const [fiscalError, setFiscalError] = useState<string | null>(null)

  const handleChange = (field: string, value: string | number) => {
    setCompanyData({ ...empresa, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Fiscal document handlers
  const handleFiscalUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setFiscalError('Solo se permiten archivos PDF, JPG, PNG o WEBP')
      toast.error('Formato no válido', {
        description: 'Solo se permiten documentos en formato PDF o imágenes JPG, PNG, WEBP'
      })
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFiscalError('El archivo es demasiado grande. Máximo 10MB')
      toast.error('Archivo muy grande', {
        description: 'El archivo debe ser menor a 10MB. Comprime el documento e intenta nuevamente.'
      })
      return
    }

    setFiscalError(null)
    setFiscalDocument(file)
    toast.success('Documento seleccionado', {
      description: `${file.name} se subirá después del registro exitoso`
    })
  }

  const handleFiscalRemove = () => {
    setFiscalDocument(null)
    setFiscalError(null)
    if (fiscalInputRef.current) {
      fiscalInputRef.current.value = ''
    }
    toast.info('Documento removido')
  }



  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '')
    return cleanPhone.length === 10
  }

  const validateRFC = (rfc: string): boolean => {
    // Mexican RFC format: 4 letters + 6 digits + 3 alphanumeric (for companies)
    // or 4 letters + 6 digits + 2 alphanumeric (for individuals)
    const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{2,3}$/
    return rfcRegex.test(rfc.toUpperCase())
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!empresa.nombre.trim()) {
      newErrors.nombre = 'El nombre de la empresa es requerido'
    }

    if (!empresa.rfc.trim()) {
      newErrors.rfc = 'El RFC es requerido'
    } else if (!validateRFC(empresa.rfc)) {
      newErrors.rfc = 'El RFC debe tener el formato correcto (ej: ABC123456XYZ)'
    }

    if (!empresa.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!validateEmail(empresa.email)) {
      newErrors.email = 'El correo electrónico debe tener un formato válido'
    }

    if (!empresa.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!validatePhone(empresa.telefono)) {
      newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos'
    }

    if (!empresa.contactoNombre.trim()) {
      newErrors.contactoNombre = 'El nombre del contacto es requerido'
    }

    if (!empresa.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (!validatePassword(empresa.password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (!empresa.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (empresa.password !== empresa.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!empresa.state) {
      newErrors.state = 'El estado es requerido'
    }

    if (!aceptaTerminos) {
      newErrors.terms = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: empresa.nombre,
          email: empresa.email,
          password: empresa.password,
          phone: empresa.telefono,
          rfc: empresa.rfc,
          sector: empresa.sector,
          direccion: empresa.direccion,
          description: empresa.descripcion,
          contactName: empresa.contactoNombre,
          contactPosition: empresa.contactoPuesto,
          state: empresa.state
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Error al registrar empresa")
        return
      }

      if (fiscalDocument) {
        toast.success("¡Cuenta creada exitosamente! Podrás subir tu constancia fiscal después de iniciar sesión.")
      } else {
        toast.success("¡Cuenta creada exitosamente!")
      }

      toast.success("Serás redirigido al login.")
      setTimeout(() => {
        router.push("/login?empresa=1")
      }, 1500)
    } catch (err) {
      console.error(err)
      toast.error("Ocurrió un error al registrar la empresa. Inténtalo de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LogoUpqroo.src} alt="Logo UPQROO" className="rounded-lg mx-auto" />
          <h1 className="text-3xl font-bold text-primary">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a la comunidad UPQROO</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de empresa</CardTitle>
            <CardDescription>Selecciona el tipo de cuenta que deseas crear</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                {/* <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Estudiante/Egresado
                </TabsTrigger> */}
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresa
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-6">
                <Button className="w-full" variant="outline" size="lg">
                  <Chrome className="mr-2 h-4 w-4" />
                  Registrarse con Google
                </Button>
                <div className="text-center text-sm text-gray-500">
                  {/* <p>Usa tu cuenta @upqroo.edu.mx para acceso automático</p> */}
                  <p>Usa tu cuenta de Google para acceso automático</p>
                  <p className="mt-2">Tu perfil se creará automáticamente con los datos institucionales</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Información que se sincronizará:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Nombre completo</li>
                    {/* <li>• Carrera y semestre actual</li> */}
                    <li>• Correo electrónico</li>
                    {/* <li>• Estado académico (estudiante/egresado)</li> */}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nombre de la Empresa *</Label>
                      <Input 
                        id="company-name" 
                        value={empresa.nombre} 
                        onChange={e => handleChange("nombre", e.target.value)}
                        className={cn(errors.nombre && "border-red-500")}
                        placeholder="Ej: Tecnología Innovadora S.A. de C.V."
                      />
                      {errors.nombre && (
                        <p className="text-xs text-red-500">{errors.nombre}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rfc">RFC *</Label>
                      <Input 
                        id="rfc" 
                        value={empresa.rfc} 
                        onChange={e => handleChange("rfc", e.target.value.toUpperCase())}
                        className={cn(errors.rfc && "border-red-500")}
                        placeholder="ABC123456XYZ"
                        maxLength={13}
                      />
                      {errors.rfc && (
                        <p className="text-xs text-red-500">{errors.rfc}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Formato: 3-4 letras + 6 dígitos + 2-3 caracteres
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico Corporativo *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={empresa.email} 
                      onChange={e => handleChange("email", e.target.value)}
                      className={cn(errors.email && "border-red-500")}
                      placeholder="contacto@empresa.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input 
                        id="phone" 
                        value={empresa.telefono} 
                        onChange={e => handleChange("telefono", e.target.value.replace(/\D/g, ''))}
                        className={cn(errors.telefono && "border-red-500")}
                        placeholder="5551234567"
                        maxLength={10}
                      />
                      {errors.telefono && (
                        <p className="text-xs text-red-500">{errors.telefono}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        10 dígitos sin espacios ni guiones
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sector">Sector Industrial</Label>
                      <Select onValueChange={(value) => handleChange("sector", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sector" />
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
                  </div>

                  <div className="space-y-2">
                    <Label>Estado *</Label>
                    <StateSelect 
                      value={empresa.state} 
                      onChange={(id) => handleChange("state", id)}
                      className={cn(errors.state && "border-red-500")}
                    />
                    {errors.state && (
                      <p className="text-xs text-red-500">{errors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección Completa</Label>
                    <Textarea 
                      id="address" 
                      value={empresa.direccion} 
                      onChange={e => handleChange("direccion", e.target.value)}
                      placeholder="Calle, número, colonia, ciudad, código postal"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción de la Empresa</Label>
                    <Textarea 
                      id="description" 
                      value={empresa.descripcion} 
                      onChange={e => handleChange("descripcion", e.target.value)}
                      placeholder="Describe brevemente tu empresa, servicios y cultura organizacional"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Nombre del Contacto *</Label>
                      <Input 
                        id="contact-name" 
                        value={empresa.contactoNombre} 
                        onChange={e => handleChange("contactoNombre", e.target.value)}
                        className={cn(errors.contactoNombre && "border-red-500")}
                        placeholder="Nombre y Apellido"
                      />
                      {errors.contactoNombre && (
                        <p className="text-xs text-red-500">{errors.contactoNombre}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-position">Cargo del Contacto</Label>
                      <Input 
                        id="contact-position" 
                        value={empresa.contactoPuesto} 
                        onChange={e => handleChange("contactoPuesto", e.target.value)}
                        placeholder="Gerente de Recursos Humanos"
                      />
                    </div>
                  </div>

                  {/* Fiscal Document Section */}
                  <div className="space-y-4 p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <Label className="text-green-800 font-medium">Constancia de Situación Fiscal</Label>
                    </div>
                    <p className="text-sm text-green-700">
                      Selecciona tu constancia de situación fiscal. Se subirá automáticamente después de crear tu cuenta para acelerar el proceso de validación.
                    </p>
                    
                    {fiscalError && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        {fiscalError}
                      </div>
                    )}

                    {fiscalDocument ? (
                      // Document selected - show current document with actions
                      <div className="border rounded-lg p-3 bg-white border-green-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-800">{fiscalDocument.name}</p>
                              <p className="text-sm text-green-600">
                                <CheckCircle className="inline h-4 w-4 mr-1" />
                                {(fiscalDocument.size / 1024 / 1024).toFixed(2)} MB - Se subirá después del registro
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleFiscalRemove}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // No document - show upload area
                      <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-white">
                        <FileText className="h-10 w-10 text-green-400 mx-auto mb-3" />
                        <p className="text-green-700 mb-2">Selecciona tu constancia fiscal</p>
                        <p className="text-sm text-green-600 mb-4">
                          Se subirá automáticamente después del registro
                        </p>
                      </div>
                    )}

                    {/* Upload button - always visible */}
                    <div className="flex flex-col items-center gap-2">
                      <input
                        ref={fiscalInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handleFiscalUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => fiscalInputRef.current?.click()}
                        variant={fiscalDocument ? "outline" : "default"}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {fiscalDocument ? 'Cambiar Documento' : 'Seleccionar Constancia Fiscal'}
                      </Button>
                      <p className="text-xs text-green-600 text-center">
                        Formatos: PDF, JPG, PNG, WEBP • Máximo 10MB
                      </p>
                      <p className="text-xs text-blue-600 text-center font-medium">
                        💡 También podrás subir este documento después de iniciar sesión
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={empresa.password} 
                        onChange={e => handleChange("password", e.target.value)}
                        className={cn(errors.password && "border-red-500")}
                        placeholder="Mínimo 8 caracteres"
                      />
                      {errors.password && (
                        <p className="text-xs text-red-500">{errors.password}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña *</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={empresa.confirmPassword} 
                        onChange={e => handleChange("confirmPassword", e.target.value)}
                        className={cn(errors.confirmPassword && "border-red-500")}
                        placeholder="Repite tu contraseña"
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={aceptaTerminos} 
                        onCheckedChange={() => {
                          setAceptaTerminos(!aceptaTerminos)
                          if (errors.terms) {
                            setErrors(prev => ({ ...prev, terms: '' }))
                          }
                        }} 
                      />
                      <Label htmlFor="terms" className="text-sm">
                        He leído y acepto la<Link href="/terms" target="_blank" className="underline text-blue-500">política de privacidad</Link>
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-xs text-red-500">{errors.terms}</p>
                    )}
                  </div>

                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  <Button className="w-full cursor-pointer" size="lg" disabled={loading}>
                    {loading ? "Creando cuenta..." : "Crear Cuenta Empresarial"}
                  </Button>

                  <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Nota:</strong> Tu cuenta será revisada por el equipo de coordinación de UPQROO antes de ser
                      activada. Recibirás un correo de confirmación en 1-2 días hábiles.
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login">
                  <Button variant="link" className="p-0 h-auto cursor-pointer">
                    Iniciar sesión
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
