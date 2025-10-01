"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Search,
  Target,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Award,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function EmpresasLanding() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Form submitted:', formData)
  }

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

  const testimonials = [
    {
      name: "María González",
      position: "Directora de RRHH",
      company: "TechSolutions México",
      content: "UPQROO nos ha ayudado a encontrar desarrolladores junior excepcionales. La calidad de los candidatos es impresionante.",
      rating: 5
    },
    {
      name: "Carlos Mendoza",
      position: "CEO",
      company: "InnovaCorp",
      content: "La plataforma es muy fácil de usar y hemos contratado a 15 estudiantes en los últimos 6 meses. Altamente recomendado.",
      rating: 5
    },
    {
      name: "Ana Rodríguez",
      position: "Gerente de Talento",
      company: "Digital Dynamics",
      content: "Los estudiantes de UPQROO llegan con una preparación técnica sólida y muchas ganas de aprender y crecer.",
      rating: 5
    }
  ]

  const plans = [
    {
      name: "Básico",
      price: "Gratis",
      description: "Perfecto para empresas que están comenzando",
      features: [
        "Hasta 3 vacantes activas",
        "Acceso a base de candidatos",
        "Soporte por email",
        "Estadísticas básicas"
      ],
      popular: false
    },
    {
      name: "Profesional",
      price: "$2,999/mes",
      description: "Ideal para empresas en crecimiento",
      features: [
        "Vacantes ilimitadas",
        "Búsqueda avanzada de candidatos",
        "Soporte prioritario",
        "Análisis detallados",
        "Gestión de equipo",
        "Branding personalizado"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Contactar",
      description: "Para grandes empresas con necesidades específicas",
      features: [
        "Todo lo del plan Profesional",
        "Integración con ATS",
        "Gerente de cuenta dedicado",
        "Reportes personalizados",
        "API access",
        "Capacitación personalizada"
      ],
      popular: false
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
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonios</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Precios</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contacto</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Contacto
              </Button>
              <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Solicitar Demo
              </Button>
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestras empresas
            </h2>
            <p className="text-xl text-gray-600">
              Más de 500 empresas confían en nosotros para encontrar talento
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-gray-600">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.position}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes que se adaptan a tu empresa
            </h2>
            <p className="text-xl text-gray-600">
              Desde startups hasta grandes corporaciones, tenemos el plan perfecto para ti
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-0 shadow-lg ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? '' : 'variant-outline'}`}>
                    {plan.price === "Contactar" ? "Contactar Ventas" : "Comenzar Ahora"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ¿Listo para encontrar tu próximo gran talento?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Nuestro equipo está aquí para ayudarte a comenzar. Contáctanos y descubre cómo podemos 
                ayudar a tu empresa a crecer con el mejor talento universitario.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>empresas@upqroo.edu.mx</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+52 (998) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Cancún, Quintana Roo, México</span>
                </div>
              </div>
            </div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Solicita una Demo</CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Nombre de la Empresa</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Corporativo</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Cuéntanos sobre tus necesidades de reclutamiento..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Solicitar Demo
                  </Button>
                </form>
              </CardContent>
            </Card>
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