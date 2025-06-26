import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chrome, Building2, GraduationCap } from "lucide-react"
import LogoUpqroo from "@/assets/logo_upqroo.svg"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
      <img src={LogoUpqroo.src} alt="Logo UPQROO" className="rounded-lg mx-auto" />
          <h1 className="text-3xl font-bold text-blue-600">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a la comunidad UPQROO</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Usuario</CardTitle>
            <CardDescription>Selecciona el tipo de cuenta que deseas crear</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Estudiante/Egresado
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresa
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-6">
                <Button className="w-full" variant="outline" size="lg">
                  <Chrome className="mr-2 h-4 w-4" />
                  Registrarse con Google Institucional
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>Usa tu cuenta @upqroo.edu.mx para acceso automático</p>
                  <p className="mt-2">Tu perfil se creará automáticamente con los datos institucionales</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Información que se sincronizará:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Nombre completo</li>
                    <li>• Carrera y semestre actual</li>
                    <li>• Correo institucional</li>
                    <li>• Estado académico (estudiante/egresado)</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nombre de la Empresa *</Label>
                    <Input id="company-name" placeholder="Ej: TechCorp México" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rfc">RFC *</Label>
                    <Input id="rfc" placeholder="XAXX010101000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico Corporativo *</Label>
                  <Input id="email" type="email" placeholder="contacto@empresa.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" placeholder="(998) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector Industrial</Label>
                    <Select>
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
                  <Label htmlFor="address">Dirección Completa</Label>
                  <Textarea id="address" placeholder="Calle, número, colonia, ciudad, estado, CP" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción de la Empresa</Label>
                  <Textarea
                    id="description"
                    placeholder="Breve descripción de la empresa, servicios y cultura organizacional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nombre del Contacto *</Label>
                    <Input id="contact-name" placeholder="Responsable de RH" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-position">Cargo del Contacto</Label>
                    <Input id="contact-position" placeholder="Gerente de Recursos Humanos" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña *</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los términos y condiciones y la política de privacidad
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" />
                  <Label htmlFor="notifications" className="text-sm">
                    Deseo recibir notificaciones sobre nuevos candidatos y actualizaciones
                  </Label>
                </div>

                <Button className="w-full" size="lg">
                  Crear Cuenta Empresarial
                </Button>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Tu cuenta será revisada por el equipo de coordinación de UPQROO antes de ser
                    activada. Recibirás un correo de confirmación en 1-2 días hábiles.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Iniciar sesión
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
