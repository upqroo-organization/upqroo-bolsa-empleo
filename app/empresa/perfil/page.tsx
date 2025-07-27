import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Building2, Upload, Save, Mail, Users, CheckCircle, Settings, Bell, Shield, Eye } from "lucide-react"

export default function CompanyProfile() {
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
            <p className="text-2xl font-bold text-green-600">92%</p>
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Profile Completion Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>¡Buen trabajo!</strong> Tu perfil está casi completo. Agrega tu logo y redes sociales para mejorar tu
          visibilidad.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
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
                  <div className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">PNG, JPG. Max 2MB</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                      <Input id="companyName" defaultValue="TechCorp México" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rfc">RFC *</Label>
                      <Input id="rfc" defaultValue="TCM123456789" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sector">Sector Industrial</Label>
                      <Select defaultValue="tech">
                        <SelectTrigger>
                          <SelectValue />
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
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-10)</SelectItem>
                          <SelectItem value="small">Pequeña (11-50)</SelectItem>
                          <SelectItem value="medium">Mediana (51-200)</SelectItem>
                          <SelectItem value="large">Grande (201-1000)</SelectItem>
                          <SelectItem value="enterprise">Corporativo (1000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción de la Empresa</Label>
                <Textarea
                  id="description"
                  rows={4}
                  defaultValue="TechCorp México es una empresa líder en desarrollo de software y soluciones tecnológicas para el sector empresarial. Nos especializamos en crear aplicaciones web y móviles innovadoras que impulsan el crecimiento de nuestros clientes."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Misión</Label>
                <Textarea
                  id="mission"
                  rows={3}
                  defaultValue="Transformar ideas en soluciones tecnológicas que generen valor real para nuestros clientes y contribuyan al desarrollo digital de México."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="values">Valores Corporativos</Label>
                <div className="flex flex-wrap gap-2">
                  {["Innovación", "Calidad", "Trabajo en Equipo", "Responsabilidad", "Excelencia"].map(
                    (value, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {value}
                        <button className="ml-1 hover:text-destructive">×</button>
                      </Badge>
                    ),
                  )}
                  <Button variant="outline" size="sm">
                    + Agregar
                  </Button>
                </div>
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
                  <Input id="email" type="email" defaultValue="contacto@techcorp.mx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono Principal *</Label>
                  <Input id="phone" defaultValue="(998) 123-4567" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input id="website" defaultValue="https://www.techcorp.mx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" defaultValue="https://linkedin.com/company/techcorp-mexico" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección Completa *</Label>
                <Textarea
                  id="address"
                  rows={3}
                  defaultValue="Av. Bonampak #123, Supermanzana 20, Cancún, Quintana Roo, México, CP 77500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input id="city" defaultValue="Cancún" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Select defaultValue="qroo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qroo">Quintana Roo</SelectItem>
                      <SelectItem value="yuc">Yucatán</SelectItem>
                      <SelectItem value="camp">Campeche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Código Postal *</Label>
                  <Input id="zipCode" defaultValue="77500" />
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Persona de Contacto RH</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hrName">Nombre Completo *</Label>
                      <Input id="hrName" defaultValue="Lic. María González Pérez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrPosition">Cargo *</Label>
                      <Input id="hrPosition" defaultValue="Gerente de Recursos Humanos" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hrEmail">Correo Electrónico *</Label>
                      <Input id="hrEmail" type="email" defaultValue="rh@techcorp.mx" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrPhone">Teléfono Directo</Label>
                      <Input id="hrPhone" defaultValue="(998) 123-4568" />
                    </div>
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
                Detalles de la Empresa
              </CardTitle>
              <CardDescription>Información adicional y beneficios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="founded">Año de Fundación</Label>
                  <Input id="founded" defaultValue="2018" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Número de Empleados</Label>
                  <Select defaultValue="51-200">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 empleados</SelectItem>
                      <SelectItem value="11-50">11-50 empleados</SelectItem>
                      <SelectItem value="51-200">51-200 empleados</SelectItem>
                      <SelectItem value="201-500">201-500 empleados</SelectItem>
                      <SelectItem value="500+">500+ empleados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Beneficios que Ofreces</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Seguro de Gastos Médicos",
                    "Vales de Despensa",
                    "Home Office",
                    "Capacitación Continua",
                    "Bonos por Desempeño",
                    "Días de Vacaciones Adicionales",
                    "Gimnasio",
                    "Transporte",
                    "Comedor",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" id={benefit} defaultChecked={index < 5} />
                      <label htmlFor={benefit} className="text-sm">
                        {benefit}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="culture">Cultura Organizacional</Label>
                <Textarea
                  id="culture"
                  rows={4}
                  defaultValue="En TechCorp fomentamos un ambiente colaborativo e innovador donde cada miembro del equipo puede crecer profesionalmente. Valoramos la diversidad, la creatividad y el equilibrio vida-trabajo."
                />
              </div>

              <div className="space-y-2">
                <Label>Tecnologías que Utilizan</Label>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL", "Git"].map(
                    (tech, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tech}
                        <button className="ml-1 hover:text-destructive">×</button>
                      </Badge>
                    ),
                  )}
                  <Button variant="outline" size="sm">
                    + Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad de la Cuenta
              </CardTitle>
              <CardDescription>Gestiona la seguridad de tu cuenta empresarial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Cambiar Contraseña</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Actualizar Contraseña</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Autenticación de Dos Factores</h4>
                  <p className="text-sm text-muted-foreground mb-3">Agrega una capa extra de seguridad a tu cuenta</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado: Desactivado</span>
                    <Button variant="outline">Configurar 2FA</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sesiones Activas</h4>
                  <p className="text-sm text-muted-foreground mb-3">Gestiona los dispositivos con acceso a tu cuenta</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="text-sm font-medium">Navegador actual</p>
                        <p className="text-xs text-muted-foreground">Chrome en Windows - Cancún, México</p>
                      </div>
                      <Badge variant="secondary">Activa</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-3">
                    Ver Todas las Sesiones
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline">Cancelar</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar Todos los Cambios
        </Button>
      </div>
    </div>
  )
}
