import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Mail, ExternalLink, Code, Palette, Database, Server } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Contributors data - you can update this with current information
const contributors = [
  {
    id: 1,
    name: "Edgar Osvaldo Pech García",
    role: "Full Stack Developer",
    description: "Desarrollador principal encargado del desarrollo y arquitectura del sistema.",
    avatar: "/placeholder-avatar-1.jpg", // Replace with actual image
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Prisma", "MySQL", "Figma", "Tailwind CSS"],
    contributions: [
      "Arquitectura del sistema",
      "Diseño UX/UI",
      "Maquetación de vistas",
      "Desarrollo del backend",
      "Integración de base de datos",
      "Sistema de autenticación"
    ],
    links: {
      github: "https://github.com/Nfsedg",
      linkedin: "https://www.linkedin.com/in/nfsedg/",
      email: "edgaropech@hotmail.com"
    }
  },
  {
    id: 2,
    name: "Nancy Isabella Sanchez Rodriguez",
    role: "Frontend Developer & UI/UX Designer",
    description: "Desarrolladora de FrontEnd.",
    avatar: "/placeholder-avatar-2.jpg", // Replace with actual image
    skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "UI/UX Design"],
    contributions: [
      "Diseño de interfaz de usuario",
      "Desarrollo del frontend",
      "Experiencia de usuario",
      "Diseño responsive"
    ],
    links: {
      github: "https://github.com/nancy7895",
      email: "isa247bella@gmail.com"
    }
  }
]

const technologies = [
  { name: "Next.js 15", icon: Code, description: "Framework de React para aplicaciones web" },
  { name: "TypeScript", icon: Code, description: "Lenguaje de programación tipado" },
  { name: "Tailwind CSS", icon: Palette, description: "Framework de CSS utilitario" },
  { name: "Prisma", icon: Database, description: "ORM para base de datos" },
  { name: "MySQL", icon: Database, description: "Sistema de gestión de base de datos" },
  { name: "NextAuth.js", icon: Server, description: "Autenticación para Next.js" }
]

export default function AutoresPage() {
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
              Creadores del Proyecto
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Conoce al equipo de desarrolladores que hizo posible la Bolsa de Trabajo Universitaria de UPQROO
            </p>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Sobre el Proyecto</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              La Bolsa de Trabajo Universitaria es una plataforma web desarrollada para conectar estudiantes y egresados 
              de la Universidad Politécnica de Quintana Roo con oportunidades laborales. Este proyecto fue creado con 
              tecnologías modernas para ofrecer una experiencia óptima tanto para estudiantes como para empresas.
            </p>
            
            {/* Technologies Used */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {technologies.map((tech, index) => {
                const Icon = tech.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Equipo de Desarrollo</h2>
            <p className="text-xl text-muted-foreground">
              Los desarrolladores que hicieron posible este proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contributors.map((contributor) => (
              <Card key={contributor.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={contributor.avatar} alt={contributor.name} />
                    <AvatarFallback className="text-lg">
                      {contributor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{contributor.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {contributor.role}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground text-center">
                    {contributor.description}
                  </p>

                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Tecnologías</h4>
                    <div className="flex flex-wrap gap-2">
                      {contributor.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Contributions */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Contribuciones</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {contributor.contributions.map((contribution, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                          {contribution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-3 pt-4 border-t">
                    {contributor.links.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={contributor.links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {contributor.links.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={contributor.links.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {contributor.links.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${contributor.links.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Estadísticas del Proyecto</h2>
            <p className="text-xl text-muted-foreground">
              Algunos números sobre el desarrollo de la plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <p className="text-muted-foreground">Desarrolladores</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">6</div>
                <p className="text-muted-foreground">Tecnologías Principales</p>
              </CardContent>
            </Card>
            {/* <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <p className="text-muted-foreground">Roles de Usuario</p>
              </CardContent>
            </Card> */}
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">2025</div>
                <p className="text-muted-foreground">Año de Desarrollo</p>
              </CardContent>
            </Card>
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
              Desarrollado para la Universidad Politécnica de Quintana Roo
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
                <Button variant="outline" className="border-white text-primary hover:bg-white hover:text-primary">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}