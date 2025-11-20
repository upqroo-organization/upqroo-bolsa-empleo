import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, Building2, GraduationCap, TrendingUp, LogIn } from "lucide-react"
import Link from "next/link"
import StateSelectServerSide from "@/components/StateSelectorServerSide"
import { getFeaturedJobs, getJobsStats } from "@/lib/featured-jobs"
import { generateMetadata } from "@/components/SEOHead"
import StructuredData from "@/components/StructuredData"
import { pageMetadata } from "@/lib/seo"
import Image from "next/image"
import FeaturedEvents from "@/components/FeaturedEvents"
import FeaturedJobsCarousel from "@/components/FeaturedJobsCarousel"

// Metadatos específicos para la página principal
export const metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  keywords: pageMetadata.home.keywords.split(', '),
  canonical: "https://redtalento.upqroo.edu.mx"
})

export default async function LandingPage() {
  // Fetch real data - Get 10 featured jobs for carousel
  const [featuredJobs, jobsStats] = await Promise.all([
    getFeaturedJobs(10),
    getJobsStats()
  ])

  const stats = [
    {
      icon: Users,
      value: jobsStats.totalUsers > 0 ? `${jobsStats.totalUsers.toLocaleString()}+` : "0",
      label: "Estudiantes Registrados",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Building2,
      value: jobsStats.totalCompanies > 0 ? `${jobsStats.totalCompanies.toLocaleString()}+` : "0",
      label: "Empresas Activas",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: GraduationCap,
      value: jobsStats.totalJobs > 0 ? `${jobsStats.totalJobs.toLocaleString()}+` : "0",
      label: "Vacantes Publicadas",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: TrendingUp,
      value: jobsStats.successfulPlacements > 0 ? `${jobsStats.successfulPlacements}` : "0",
      label: "Colocaciones Exitosas",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      // subtitle: jobsStats.placementRate > 0 ? `${jobsStats.placementRate}% tasa de éxito` : "0% tasa de éxito"
    },
  ] as Array<{
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    label: string;
    color: string;
    bgColor: string;
    subtitle?: string;
  }>
  
  return (
    <div className="min-h-screen">
      {/* Datos estructurados para la página principal */}
      <StructuredData type="organization" />
      <StructuredData type="website" />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-24">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="w-full">
            <Image className="mx-auto mb-6" src="/upqroo_logo_outlined.svg" alt="logo_upqroo" width={300} height={200} />
          </div>
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
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 h-12 px-8 cursor-pointer">
                  <LogIn/>
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <form action="/vacantes" method="get" className="flex flex-col md:flex-row gap-4 items-end">
                <div className="md:flex-1 w-full space-y-2">
                  <label className="text-sm font-medium">¿Qué trabajo buscas?</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 wmercad-4 text-muted-foreground" />
                    <Input name="vacante" type="text" placeholder="Buscar empleos, empresas o carreras..." className="pl-10 h-12" />
                  </div>
                </div>
                <div className="w-full md:flex-1 space-y-2">
                  <StateSelectServerSide name="estado"/>
                </div>
                <Button type="submit" size="lg" className="h-12 px-8">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vacantes Destacadas</h2>
            <p className="text-xl text-muted-foreground">Oportunidades perfectas para tu perfil profesional</p>
          </div>
          
          <FeaturedJobsCarousel jobs={featuredJobs} />

          <div className="text-center mt-12">
            <Link href="/vacantes">
              <Button variant="outline" size="lg">
                Ver Todas las Vacantes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <FeaturedEvents />

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
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
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
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 h-12 px-8">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Iniciar sesión como Estudiante
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-primary hover:bg-white hover:text-primary h-12 px-8"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Registrar Empresa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div>
              <Link href="https://upqroo.edu.mx/" target="__blank" className="flex items-center justify-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Image src="/logo_upqroo_150.png" alt="logo_pequeño_upqroo" width={80} height={80} />
                </div>
                <span className="text-xl font-bold text-primary">UPQROO</span>
              </Link>
            </div>
            <p className="text-muted-foreground">
              © 2025 Universidad Politécnica de Quintana Roo. Todos los derechos reservados.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              {/* <a href="#" className="hover:text-primary transition-colors">
                Términos de Uso
              </a> */}
              <a href="/terms" className="hover:text-primary transition-colors">
                Aviso de Privacidad
              </a>
              {/* <a href="#" className="hover:text-primary transition-colors">
                Contacto
              </a> */}
              <a href="/autores" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Autores</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}