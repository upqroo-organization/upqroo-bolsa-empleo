import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, Edit, Plus, X, ExternalLink } from "lucide-react"

export default function StudentProfile() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Editar Perfil
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Académico</TabsTrigger>
          <TabsTrigger value="experience">Experiencia</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos básicos de tu perfil profesional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Cambiar Foto
                  </Button>
                  <p className="text-sm text-gray-600">Formatos: JPG, PNG. Tamaño máximo: 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre(s)</Label>
                  <Input id="firstName" defaultValue="Juan Carlos" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input id="lastName" defaultValue="Pérez González" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Institucional</Label>
                  <Input id="email" defaultValue="juan.perez@upqroo.edu.mx" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue="(998) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea id="address" defaultValue="Av. Universidad #123, Col. Centro, Cancún, Q.Roo, CP 77500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Descripción Profesional</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe brevemente tu perfil profesional, objetivos y lo que te hace único..."
                  defaultValue="Estudiante de Ingeniería en Software con pasión por el desarrollo web y móvil. Experiencia en React, Node.js y bases de datos. Busco oportunidades para aplicar mis conocimientos en proyectos reales y continuar mi crecimiento profesional."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Académica</CardTitle>
              <CardDescription>Detalles de tu formación universitaria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="career">Carrera</Label>
                  <Select defaultValue="software">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software">Ingeniería en Software</SelectItem>
                      <SelectItem value="systems">Ingeniería en Sistemas</SelectItem>
                      <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                      <SelectItem value="business">Licenciatura en Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre Actual</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          {sem}° Semestre
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpa">Promedio General</Label>
                  <Input id="gpa" defaultValue="8.7" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado Académico</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Estudiante Activo</SelectItem>
                      <SelectItem value="graduate">Egresado</SelectItem>
                      <SelectItem value="thesis">En Proceso de Titulación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input id="startDate" type="date" defaultValue="2021-08-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedGraduation">Graduación Esperada</Label>
                  <Input id="expectedGraduation" type="date" defaultValue="2025-07-15" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Materias Destacadas</Label>
                <div className="flex flex-wrap gap-2">
                  {["Desarrollo Web", "Base de Datos", "Ingeniería de Software", "Programación Móvil", "Redes"].map(
                    (subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ),
                  )}
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Experiencia Laboral</CardTitle>
                  <CardDescription>Historial de empleos, prácticas y proyectos</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Experiencia
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: "Desarrollador Frontend (Prácticas)",
                  company: "TechStart Solutions",
                  period: "Enero 2024 - Presente",
                  description:
                    "Desarrollo de interfaces web responsivas usando React y Tailwind CSS. Colaboración en equipo ágil para la creación de aplicaciones web modernas.",
                  current: true,
                },
                {
                  title: "Asistente de Desarrollo",
                  company: "Freelance",
                  period: "Junio 2023 - Diciembre 2023",
                  description:
                    "Desarrollo de sitios web para pequeñas empresas locales. Mantenimiento y actualización de sistemas existentes.",
                  current: false,
                },
              ].map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{exp.title}</h4>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.period}</p>
                      {exp.current && (
                        <Badge variant="secondary" className="mt-1">
                          Actual
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Técnicas</CardTitle>
              <CardDescription>Tecnologías, herramientas y competencias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Lenguajes de Programación</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["JavaScript", "Python", "Java", "C#", "TypeScript"].map((skill, index) => (
                      <Badge key={index} variant="default">
                        {skill}
                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Frameworks y Librerías</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["React", "Node.js", "Express", "Next.js", "Bootstrap"].map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Bases de Datos</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["MySQL", "PostgreSQL", "MongoDB", "Firebase"].map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Herramientas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Git", "Docker", "VS Code", "Figma", "Postman"].map((skill, index) => (
                      <Badge key={index} variant="destructive">
                        {skill}
                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Habilidades Blandas</Label>
                <div className="flex flex-wrap gap-2">
                  {["Trabajo en Equipo", "Comunicación", "Resolución de Problemas", "Liderazgo", "Adaptabilidad"].map(
                    (skill, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-800">
                        {skill}
                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ),
                  )}
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos y Portafolio</CardTitle>
              <CardDescription>CV, certificaciones y enlaces a proyectos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="font-semibold mb-2">Curriculum Vitae</h4>
                  <p className="text-sm text-gray-600 mb-4">Sube tu CV actualizado en formato PDF</p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Subir CV
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded">
                        <Download className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">CV_Juan_Perez_2024.pdf</p>
                        <p className="text-sm text-gray-600">Subido el 10 de Junio, 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Enlaces de Portafolio</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input placeholder="https://github.com/juanperez" defaultValue="https://github.com/juanperez" />
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="https://linkedin.com/in/juanperez"
                      defaultValue="https://linkedin.com/in/juanperez"
                    />
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input placeholder="https://portafolio.com" />
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Certificaciones</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Sube certificaciones, diplomas o constancias</p>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Agregar Certificación
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Guardar Cambios</Button>
      </div>
    </div>
  )
}
