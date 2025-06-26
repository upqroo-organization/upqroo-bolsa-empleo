import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Building2, GraduationCap, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Conectamos Talento con Oportunidades</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            La plataforma oficial de vinculación laboral de la Universidad Politécnica de Quintana Roo. Encuentra tu
            próxima oportunidad profesional o el talento que tu empresa necesita.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Buscar Empleos
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Publicar Vacante
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar empleos, empresas o carreras..." className="pl-10 h-12" />
            </div>
            <Button size="lg">Buscar</Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">1,200+</h3>
              <p className="text-gray-600">Estudiantes Registrados</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">150+</h3>
              <p className="text-gray-600">Empresas Activas</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">300+</h3>
              <p className="text-gray-600">Vacantes Publicadas</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">85%</h3>
              <p className="text-gray-600">Tasa de Colocación</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Vacantes Destacadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
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
            ].map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">📍 {job.location}</p>
                    <p className="text-sm text-gray-600">💼 {job.type}</p>
                    <p className="text-sm font-semibold text-green-600">💰 {job.salary}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para dar el siguiente paso?</h2>
          <p className="text-xl mb-8">Únete a nuestra comunidad y conecta con las mejores oportunidades laborales</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Registrarse como Estudiante
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Registrar Empresa
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
