"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Building2,
  GraduationCap,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Settings,
  BarChart3,
  Clock,
} from "lucide-react"

export default function AdminDashboard() {
  const systemStats = [
    {
      title: "Usuarios Totales",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Empresas Registradas",
      value: "156",
      change: "+8%",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Estudiantes Activos",
      value: "2,234",
      change: "+15%",
      icon: GraduationCap,
      color: "text-purple-600",
    },
    {
      title: "Coordinadores",
      value: "23",
      change: "+2",
      icon: UserCheck,
      color: "text-orange-600",
    },
  ]

  const systemHealth = [
    { name: "Base de Datos", status: "Óptimo", value: 98, color: "bg-green-500" },
    { name: "Servidor Web", status: "Óptimo", value: 95, color: "bg-green-500" },
    { name: "API Gateway", status: "Advertencia", value: 78, color: "bg-yellow-500" },
    { name: "Almacenamiento", status: "Óptimo", value: 92, color: "bg-green-500" },
  ]

  const recentActivity = [
    {
      action: "Nueva empresa registrada",
      details: "TechCorp S.A. completó su registro",
      time: "Hace 5 min",
      type: "success",
    },
    {
      action: "Error de sistema detectado",
      details: "Fallo en módulo de notificaciones",
      time: "Hace 15 min",
      type: "error",
    },
    {
      action: "Backup completado",
      details: "Respaldo automático ejecutado exitosamente",
      time: "Hace 1 hora",
      type: "info",
    },
    {
      action: "Usuario bloqueado",
      details: "Cuenta suspendida por actividad sospechosa",
      time: "Hace 2 horas",
      type: "warning",
    },
    {
      action: "Actualización de sistema",
      details: "Parche de seguridad aplicado",
      time: "Hace 3 horas",
      type: "success",
    },
  ]

  const pendingTasks = [
    { task: "Revisar reportes de seguridad", priority: "Alta", due: "Hoy" },
    { task: "Actualizar políticas de privacidad", priority: "Media", due: "Mañana" },
    { task: "Mantenimiento programado BD", priority: "Alta", due: "Viernes" },
    { task: "Auditoría de usuarios inactivos", priority: "Baja", due: "Próxima semana" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrador</h1>
          <p className="text-muted-foreground">Panel de control y monitoreo del sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {/* Estadísticas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado del Sistema */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Estado del Sistema
            </CardTitle>
            <CardDescription>Monitoreo en tiempo real de los componentes del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealth.map((component, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{component.name}</span>
                  <Badge variant={component.status === "Óptimo" ? "default" : "secondary"}>{component.status}</Badge>
                </div>
                <Progress value={component.value} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">{component.value}% disponibilidad</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tareas Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Tareas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="text-sm font-medium">{task.task}</div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      task.priority === "Alta" ? "destructive" : task.priority === "Media" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{task.due}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Actividad Reciente del Sistema
          </CardTitle>
          <CardDescription>Registro de eventos y acciones importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "error"
                        ? "bg-red-500"
                        : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.details}</div>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas del Sistema */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="text-sm">Espacio en disco al 85% en servidor principal</span>
              <Button variant="outline" size="sm">
                Revisar
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="text-sm">3 intentos de acceso fallidos detectados</span>
              <Button variant="outline" size="sm">
                Investigar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
