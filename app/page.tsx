import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Building2, GraduationCap, TrendingUp, MapPin, Clock, DollarSign } from "lucide-react"
// import Link from "next/link"

const featuredJobs = [
    {
      title: "Desarrollador Frontend React",
      company: "TechCorp México",
      location: "Cancún, Q.Roo",
      type: "Tiempo Completo",
      salary: "$25,000 - $35,000",
      tags: ["React", "JavaScript", "CSS"],
    },
    {
      title: "Analista de Datos",
      company: "DataSolutions",
      location: "Playa del Carmen",
      type: "Prácticas",
      salary: "$8,000 - $12,000",
      tags: ["Python", "SQL", "Excel"],
    },
    {
      title: "Ingeniero de Software",
      company: "Innovation Labs",
      location: "Remoto",
      type: "Tiempo Completo",
      salary: "$30,000 - $45,000",
      tags: ["Java", "Spring", "AWS"],
    },
  ]

  const stats = [
    {
      icon: Users,
      value: "1,200+",
      label: "Estudiantes Registrados",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Building2,
      value: "150+",
      label: "Empresas Activas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: GraduationCap,
      value: "300+",
      label: "Vacantes Publicadas",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "Tasa de Colocación",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-24">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Conectamos Talento con{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Oportunidades
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              La plataforma oficial de vinculación laboral de la Universidad Politécnica de Quintana Roo. Encuentra tu
              próxima oportunidad profesional o el talento que tu empresa necesita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 h-12 px-8">
                <Search className="mr-2 h-5 w-5" />
                Buscar Empleos
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary h-12 px-8"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Publicar Vacante
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">¿Qué trabajo buscas?</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar empleos, empresas o carreras..." className="pl-10 h-12" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Ubicación</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Ciudad, estado o remoto" className="pl-10 h-12" />
                  </div>
                </div>
                <Button size="lg" className="h-12 px-8">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestra Comunidad en Números</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conectando estudiantes, egresados y empresas en Quintana Roo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div
                      className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vacantes Destacadas</h2>
            <p className="text-xl text-muted-foreground">Oportunidades perfectas para tu perfil profesional</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {job.company}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full">Ver Detalles</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Ver Todas las Vacantes
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">¿Listo para dar el siguiente paso?</h2>
            <p className="text-xl text-primary-foreground/90">
              Únete a nuestra comunidad y conecta con las mejores oportunidades laborales en Quintana Roo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 h-12 px-8">
                <GraduationCap className="mr-2 h-5 w-5" />
                Registrarse como Estudiante
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary h-12 px-8"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Registrar Empresa
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">UP</span>
              </div>
              <span className="text-xl font-bold text-primary">UPQROO</span>
            </div>
            <p className="text-muted-foreground">
              © 2025 Universidad Politécnica de Quintana Roo. Todos los derechos reservados.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
