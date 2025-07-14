import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Clock, DollarSign, MapPin, Share } from "lucide-react"
import { Button } from "./ui/button"
import { Careers, VacanteInterface, VacanteModalityEnum, VacanteTypeEnum } from "@/types/vacantes"
import { Badge } from "@/components/ui/badge"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { getEnumLabelSafe } from "@/utils"

dayjs.extend(relativeTime);
dayjs.locale('es');

type VacanteCardProps = {
  vacante: VacanteInterface
}

export default function VacanteCard({ vacante }: VacanteCardProps) {
  return (
    <Card
      key={vacante.id}
      className={`hover:shadow-lg transition-shadow`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{vacante.title}</CardTitle>
              {/* <Badge className="bg-blue-100 text-blue-800">Destacado</Badge> */}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {vacante.company.name}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {vacante.location} - {vacante?.state?.name || ''}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dayjs(vacante.updatedAt).fromNow()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {vacante.type && (
              <Badge variant="secondary">
                {getEnumLabelSafe(VacanteTypeEnum, vacante.type)}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <DollarSign className="h-4 w-4" />
              {vacante.salaryMin} - {vacante.salaryMax}
            </div>
            {vacante.modality && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {getEnumLabelSafe(VacanteModalityEnum, vacante.modality)}
              </Badge>
            )}
            {vacante.career && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {getEnumLabelSafe(Careers, vacante.career)}
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-700">{vacante.description}</p>

          {/* <div className="flex flex-wrap gap-2">
            {vacante.requirements.map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req}
              </Badge>
            ))}
          </div> */}

          <div className="flex gap-2 pt-2">
            <Button className="flex-1">Postularme</Button>
            <Button variant="outline">Ver Detalles</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
