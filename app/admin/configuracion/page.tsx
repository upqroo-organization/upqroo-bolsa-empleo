"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Database,
  Mail,
  Shield,
  Bell,
  Palette,
  Save,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  Server,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SystemConfig() {
  const [showPasswords, setShowPasswords] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)

  const configSections = [
    {
      id: "general",
      title: "General",
      icon: Settings,
      description: "Configuración general del sistema",
    },
    {
      id: "database",
      title: "Base de Datos",
      icon: Database,
      description: "Configuración de conexión a base de datos",
    },
    {
      id: "email",
      title: "Email",
      icon: Mail,
      description: "Configuración del servidor de correo",
    },
    {
      id: "security",
      title: "Seguridad",
      icon: Shield,
      description: "Configuración de seguridad y autenticación",
    },
    {
      id: "notifications",
      title: "Notificaciones",
      icon: Bell,
      description: "Configuración de notificaciones del sistema",
    },
    {
      id: "appearance",
      title: "Apariencia",
      icon: Palette,
      description: "Configuración de tema y apariencia",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Administra la configuración global del sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Config
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar Config
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Estado del Sistema */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">Operativo</Badge>
              <span className="text-sm">Sistema funcionando correctamente</span>
            </div>
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-green-600" />
              <span className="text-sm">Servidor: 99.9% uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-600" />
              <span className="text-sm">BD: Conexión estable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {configSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center space-x-1">
              <section.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configuración básica del sistema y la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Nombre de la Aplicación</Label>
                  <Input id="app-name" defaultValue="UPQROO Bolsa de Trabajo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-version">Versión</Label>
                  <Input id="app-version" defaultValue="1.0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email del Administrador</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@upqroo.edu.mx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="america/mexico_city">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/mexico_city">América/Ciudad de México</SelectItem>
                      <SelectItem value="america/cancun">América/Cancún</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo de Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Activa el modo de mantenimiento para realizar actualizaciones
                    </p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Realiza backups automáticos diarios de la base de datos
                    </p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Base de Datos */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Base de Datos</CardTitle>
              <CardDescription>Configuración de conexión y parámetros de la base de datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Host</Label>
                  <Input id="db-host" defaultValue="localhost" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Puerto</Label>
                  <Input id="db-port" defaultValue="5432" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Nombre de la Base de Datos</Label>
                  <Input id="db-name" defaultValue="upqroo_jobs" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user">Usuario</Label>
                  <Input id="db-user" defaultValue="upqroo_user" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-password">Contraseña</Label>
                  <div className="relative">
                    <Input id="db-password" type={showPasswords ? "text" : "password"} defaultValue="••••••••••" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-pool">Pool de Conexiones</Label>
                  <Input id="db-pool" defaultValue="20" />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Probar Conexión
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Backup Manual
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Email */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Email</CardTitle>
              <CardDescription>Configuración del servidor SMTP para envío de correos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input id="smtp-host" defaultValue="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Puerto</Label>
                  <Input id="smtp-port" defaultValue="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Usuario SMTP</Label>
                  <Input id="smtp-user" defaultValue="noreply@upqroo.edu.mx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Contraseña SMTP</Label>
                  <Input id="smtp-password" type={showPasswords ? "text" : "password"} defaultValue="••••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">Nombre del Remitente</Label>
                  <Input id="from-name" defaultValue="UPQROO Bolsa de Trabajo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">Email del Remitente</Label>
                  <Input id="from-email" defaultValue="noreply@upqroo.edu.mx" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificaciones automáticas por correo electrónico
                    </p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
              </div>

              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email de Prueba
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>Configuración de autenticación y políticas de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                  <Input id="session-timeout" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Máximo Intentos de Login</Label>
                  <Input id="max-login-attempts" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-min-length">Longitud Mínima de Contraseña</Label>
                  <Input id="password-min-length" defaultValue="8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Duración de Bloqueo (minutos)</Label>
                  <Input id="lockout-duration" defaultValue="30" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Políticas de Contraseña</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">Requerir mayúsculas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">Requerir minúsculas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">Requerir números</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">Requerir símbolos</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Configuración de notificaciones del sistema y alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notificaciones de Sistema</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nuevos Registros</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando se registren nuevos usuarios</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Errores del Sistema</Label>
                      <p className="text-sm text-muted-foreground">Notificar errores críticos del sistema</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backups Completados</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando se completen los backups</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Actualizaciones Disponibles</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando haya actualizaciones disponibles</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Apariencia */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Apariencia</CardTitle>
              <CardDescription>Personalización del tema y apariencia del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema por Defecto</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma por Defecto</Label>
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-url">URL del Logo</Label>
                <Input id="logo-url" defaultValue="/logo-upqroo.png" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-css">CSS Personalizado</Label>
                <Textarea
                  id="custom-css"
                  placeholder="/* Agregar CSS personalizado aquí */"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
