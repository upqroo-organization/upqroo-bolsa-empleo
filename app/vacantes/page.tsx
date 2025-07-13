'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Search, Filter } from "lucide-react"
import useVacantes from "@/hooks/vacantes/useVacantes"
import VacanteCard from "@/components/VacanteCard"
import StateSelect from "@/components/StateSelector"
import { Pagination } from "@/components/Pagination"
import { Spinner } from "@/components/Spinner"

export default function JobSearch() {
  const { vacantes, total, handleFilters, handleCheckboxChange, resetFilters, filters, isLoading } = useVacantes();
  // const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Buscar Empleos</h1>
          <p className="text-gray-600">Encuentra tu próxima oportunidad profesional</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros Avanzados
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">¿Qué trabajo buscas?</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  onChange={(e) => {handleFilters(e.target.name, e.target.value)}} 
                  name="title"
                  value={filters.title}
                  type="text" 
                  placeholder="Ej: Desarrollador, Analista, Diseñador..." 
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Ubicación</label>
              <StateSelect value={filters.state} onChange={(name) => handleFilters("state", name)}/>
            </div>
            <Button size="lg">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Tipo de Empleo</label>
                <div className="space-y-2">
                  {["Tiempo Completo", "Medio Tiempo", "Prácticas Profesionales", "Freelance"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        checked={filters.type.includes(type)}
                        id={type} 
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("type", type, !!checked)
                        }
                      />
                      <label htmlFor={type} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">Modalidad</label>
                <div className="space-y-2">
                  {["Presencial", "Remoto", "Híbrido"].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <Checkbox checked={filters.modality.includes(mode)} id={mode} onCheckedChange={(checked) =>
                          handleCheckboxChange("modality", mode, !!checked)
                        } />
                      <label htmlFor={mode} className="text-sm">
                        {mode}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">Carrera</label>
                <Select value={filters.career} onValueChange={(value) => handleFilters("career", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Ingeniería en Software</SelectItem>
                    <SelectItem value="systems">Ingeniería en Sistemas</SelectItem>
                    <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                    <SelectItem value="business">Administración</SelectItem>
                    <SelectItem value="therapy">Terapia física</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">Rango Salarial</label>
                <Select onValueChange={(value) => {
                  const values = value.split("-");
                  console.log(values.length)
                  if(values.length > 1) {
                    handleFilters("salaryMax", values[1])
                    handleFilters("salaryMin", values[0])
                  } else {
                    handleFilters("salaryMin", values[0])
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rango" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10">$0 - $10,000</SelectItem>
                    <SelectItem value="10-20">$10,000 - $20,000</SelectItem>
                    <SelectItem value="20-30">$20,000 - $30,000</SelectItem>
                    <SelectItem value="30-40">$30,000 - $40,000</SelectItem>
                    <SelectItem value="40">$40,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={resetFilters} variant="outline" className="w-full cursor-pointer">
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Job Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Mostrando {total} empleos de 47 resultados</p>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más Recientes</SelectItem>
                <SelectItem value="salary">Mejor Salario</SelectItem>
                <SelectItem value="relevance">Más Relevantes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading 
            ? <div className="w-full flex justify-center"><Spinner/></div>
            : vacantes.map((item, i) => (<VacanteCard key={i} vacante={item}/>))}

          {/* Pagination */}
          <div className="w-full flex justify-center">
            <Pagination
              currentPage={1}
              totalPages={20}
              onPageChange={(p) => console.log(p)}
              maxVisiblePages={5}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
