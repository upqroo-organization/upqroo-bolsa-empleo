import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Users, Lock, AlertTriangle, ExternalLink, Calendar, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const termsData = [
  {
    id: 1,
    icon: Users,
    title: "Uso del Sitio",
    content: [
      "Esta plataforma está destinada exclusivamente para estudiantes, egresados y empresas de la Universidad Politécnica de Quintana Roo.",
      "Los usuarios deben proporcionar información veraz y actualizada en sus perfiles.",
      "Está prohibido el uso de la plataforma para actividades ilegales, fraudulentas o que violen estos términos.",
      "Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso."
    ]
  },
  {
    id: 2,
    icon: Shield,
    title: "Privacidad y Protección de Datos",
    content: [
      "Recopilamos únicamente la información necesaria para el funcionamiento de la plataforma.",
      "Los datos personales son tratados conforme a la Ley Federal de Protección de Datos Personales.",
      "No compartimos información personal con terceros sin consentimiento expreso.",
      "Los usuarios pueden solicitar la eliminación de sus datos en cualquier momento."
    ]
  },
  {
    id: 3,
    icon: FileText,
    title: "Propiedad Intelectual",
    content: [
      "Todo el contenido de la plataforma, incluyendo diseño, código y logotipos, es propiedad de UPQROO.",
      "Los usuarios conservan los derechos sobre el contenido que publican (CV, perfiles, etc.).",
      "Está prohibida la reproducción no autorizada del contenido de la plataforma.",
      "El uso de marcas registradas de UPQROO requiere autorización previa."
    ]
  },
  {
    id: 4,
    icon: Lock,
    title: "Responsabilidades y Limitaciones",
    content: [
      "UPQROO no garantiza la veracidad de la información publicada por usuarios o empresas.",
      "No somos responsables por las relaciones laborales que se establezcan a través de la plataforma.",
      "Los usuarios utilizan la plataforma bajo su propio riesgo.",
      "UPQROO se reserva el derecho de suspender cuentas que violen estos términos."
    ]
  },
  {
    id: 5,
    icon: AlertTriangle,
    title: "Modificaciones y Actualizaciones",
    content: [
      "Nos reservamos el derecho de modificar estos términos en cualquier momento.",
      "Los cambios serán notificados a través de la plataforma con al menos 15 días de anticipación.",
      "El uso continuado de la plataforma implica la aceptación de los nuevos términos.",
      "Los usuarios pueden cancelar su cuenta si no están de acuerdo con las modificaciones."
    ]
  }
]

const quickFacts = [
  { label: "Última actualización", value: "Enero 2025", icon: Calendar },
  { label: "Aplicable a", value: "Todos los usuarios", icon: Users },
  { label: "Jurisdicción", value: "México", icon: Shield },
  { label: "Contacto", value: "legal@upqroo.edu.mx", icon: Mail }
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-center mb-6">
              <Image 
                src="/upqroo_logo_outlined.svg" 
                alt="UPQROO Logo" 
                width={200} 
                height={120} 
                className="mx-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Términos y Condiciones
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Política de Privacidad de la Bolsa de Trabajo Universitaria UPQROO
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Última actualización: Enero 2025
            </Badge>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {quickFacts.map((fact, index) => {
              const Icon = fact.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">{fact.label}</h3>
                    <p className="text-sm text-muted-foreground">{fact.value}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Información Importante</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Antes de continuar</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Al utilizar la Bolsa de Trabajo Universitaria de UPQROO, aceptas cumplir con los siguientes 
                    términos y condiciones. Estos términos rigen el uso de nuestra plataforma y establecen los 
                    derechos y responsabilidades tanto de los usuarios como de la institución. Te recomendamos 
                    leer cuidadosamente cada sección.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Términos Detallados</h2>
              <p className="text-xl text-muted-foreground">
                Conoce tus derechos y responsabilidades al usar nuestra plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {termsData.map((section) => {
                const Icon = section.icon
                return (
                  <Card key={section.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          <CardDescription>Sección {section.id}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.content.map((item, index) => (
                          <li key={index} className="flex items-start space-x-3 text-sm">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-muted-foreground leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">¿Tienes Preguntas?</h2>
            <p className="text-xl text-muted-foreground">
              Si tienes dudas sobre estos términos o necesitas más información, no dudes en contactarnos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Correo Electrónico</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Para consultas legales y términos de uso
                  </p>
                  <Button variant="outline" asChild>
                    <a href="mailto:legal@upqroo.edu.mx">
                      Contactar
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Soporte Técnico</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Para problemas técnicos y uso de la plataforma
                  </p>
                  <Button variant="outline" asChild>
                    <a href="mailto:soporte@upqroo.edu.mx">
                      Obtener Ayuda
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                <Image src="/logo_upqroo_150.png" alt="UPQROO" width={32} height={32} />
              </div>
              <span className="text-xl font-bold">UPQROO</span>
            </div>
            <p className="text-primary-foreground/90">
              Universidad Politécnica de Quintana Roo - Bolsa de Trabajo Universitaria
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
                <Button variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
            <div className="text-sm text-primary-foreground/70 pt-4 border-t border-white/20">
              <p>© 2025 Universidad Politécnica de Quintana Roo. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
