"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Search,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  Award,
  Zap,
  Shield,
  BarChart3,
  FileText,
  UserCheck,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function EmpresasLanding() {

  const stats = [
    { icon: Users, value: "10,000+", label: "Estudiantes Activos", color: "text-primary" },
    { icon: Building2, value: "500+", label: "Empresas Registradas", color: "text-secondary" },
    { icon: Briefcase, value: "2,000+", label: "Vacantes Publicadas", color: "text-accent" },
    { icon: TrendingUp, value: "85%", label: "Tasa de Éxito", color: "text-destructive" },
  ]

  const features = [
    {
      icon: Target,
      title: "Candidatos Calificados",
      description: "Accede a estudiantes y egresados de UPQROO con las habilidades que necesitas."
    },
    {
      icon: Zap,
      title: "Publicación Rápida",
      description: "Publica tus vacantes en minutos y comienza a recibir postulaciones inmediatamente."
    },
    {
      icon: BarChart3,
      title: "Análisis Detallados",
      description: "Obtén métricas completas sobre tus vacantes y el rendimiento de tus contrataciones."
    },
    {
      icon: Shield,
      title: "Proceso Seguro",
      description: "Plataforma segura y confiable con validación de empresas y estudiantes."
    },
    {
      icon: Clock,
      title: "Soporte 24/7",
      description: "Nuestro equipo está disponible para ayudarte en todo el proceso de reclutamiento."
    },
    {
      icon: Award,
      title: "Talento Certificado",
      description: "Estudiantes con formación técnica especializada y certificaciones actualizadas."
    }
  ]



  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">UPQROO Empleos</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Características</a>
              <a href="#registro" className="text-gray-600 hover:text-gray-900">Cómo Registrarse</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/signup">
                <Button>
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
                #1 Plataforma de Empleo Universitario
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Encuentra el
                <span className="text-primary"> talento joven</span>
                <br />que tu empresa necesita
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Conecta con estudiantes y egresados de la Universidad Politécnica de Quintana Roo.
                Accede a profesionales especializados en tecnología, ingeniería y más.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Comenzar Gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Buscar Candidatos</h3>
                    <p className="text-sm text-gray-500">Encuentra el talento perfecto</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm">Desarrollador Frontend React</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm">Ingeniero de Software</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm">Analista de Datos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir UPQROO Empleos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma está diseñada específicamente para conectar empresas con el mejor talento universitario
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Process Section */}
      <section id="registro" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo registrar tu empresa?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sigue estos sencillos pasos para unirte a nuestra plataforma y comenzar a encontrar el mejor talento
            </p>
          </div>

          {/* Registration Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completa el Formulario</h3>
              <p className="text-gray-600 text-sm mb-4">
                Proporciona la información básica de tu empresa: nombre, RFC, contacto y descripción
              </p>
              <Link href="/signup">
                <Button size="sm" className="mt-2">
                  Ir al Registro
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revisión y Aprobación</h3>
              <p className="text-gray-600 text-sm">
                El equipo de UPQROO revisará tu solicitud en 1-2 días hábiles para garantizar la calidad
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Listo para Publicar!</h3>
              <p className="text-gray-600 text-sm">
                Una vez aprobada, podrás acceder a tu panel y comenzar a publicar vacantes inmediatamente
              </p>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Requisitos para el Registro</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Información Empresarial Básica</p>
                    <p className="text-sm text-gray-600">Nombre legal de la empresa, RFC válido y datos de contacto</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Correo Electrónico Corporativo</p>
                    <p className="text-sm text-gray-600">Dirección de email oficial de la empresa (no Gmail, Yahoo, etc.)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Persona de Contacto</p>
                    <p className="text-sm text-gray-600">Nombre y cargo del responsable de recursos humanos o reclutamiento</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Constancia Fiscal (Opcional)</p>
                    <p className="text-sm text-gray-600">Documento que acelera el proceso de validación</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Beneficios del Registro</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Acceso Gratuito</p>
                    <p className="text-sm text-gray-600">Publica hasta 3 vacantes sin costo alguno</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Base de Candidatos Calificados</p>
                    <p className="text-sm text-gray-600">Acceso directo a estudiantes y egresados de UPQROO</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Gestión Simplificada</p>
                    <p className="text-sm text-gray-600">Panel intuitivo para gestionar vacantes y postulaciones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-destructive rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Soporte Especializado</p>
                    <p className="text-sm text-gray-600">Acompañamiento del equipo de coordinación de UPQROO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Listo para encontrar tu próximo gran talento?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Únete a más de 500 empresas que ya confían en UPQROO para encontrar a los mejores profesionales jóvenes de México
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Registrar mi Empresa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  ¿Tienes preguntas? Contáctanos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-secondary" />
                <span className="text-xl font-bold">UPQROO Empleos</span>
              </div>
              <p className="text-gray-400">
                Conectando el mejor talento universitario con las empresas más innovadoras de México.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Acerca de</a></li>
                <li><a href="#" className="hover:text-white">Carreras</a></li>
                <li><a href="#" className="hover:text-white">Prensa</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Guías</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                <li><a href="#" className="hover:text-white">Términos</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
                <li><a href="#" className="hover:text-white">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Universidad Politécnica de Quintana Roo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}