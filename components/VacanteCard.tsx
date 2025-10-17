import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Clock, DollarSign, MapPin, Share, CheckCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Careers, VacanteInterface, VacanteModalityEnum, VacanteTypeEnum } from "@/types/vacantes"
import { Badge } from "@/components/ui/badge"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { getEnumLabelSafe } from "@/utils"
import { ExpandableImage } from "@/components/ui/expandable-image"

dayjs.extend(relativeTime);
dayjs.locale('es');

type VacanteCardProps = {
  vacante: VacanteInterface
  hasApplied?: boolean
  isAuthenticated?: boolean
  onViewDetails?: (vacante: VacanteInterface) => void
  onApply?: (vacanteId: string) => void
  onShare?: (vacante: VacanteInterface) => void
}

export default function VacanteCard({ vacante, hasApplied = false, isAuthenticated = false, onViewDetails, onApply, onShare }: VacanteCardProps) {
  return (
    <Card
      key={vacante.id}
      className={`hover:shadow-lg transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <CardTitle className="text-base sm:text-lg leading-tight">{vacante.title}</CardTitle>
              {isAuthenticated && hasApplied && (
                <Badge className="bg-green-100 text-green-800 border-green-200 w-fit">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aplicado
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{vacante.company.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{vacante.location} - {vacante?.state?.name || ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{dayjs(vacante.updatedAt).fromNow()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 self-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(vacante)}
              className="h-8 w-8 p-0"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Job Info - Left Column */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Badges and Salary Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {vacante.type && (
                  <Badge variant="secondary" className="text-xs">
                    {getEnumLabelSafe(VacanteTypeEnum, vacante.type)}
                  </Badge>
                )}
                {vacante.modality && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                    {getEnumLabelSafe(VacanteModalityEnum, vacante.modality)}
                  </Badge>
                )}
                {vacante.career && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                    {getEnumLabelSafe(Careers, vacante.career)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-green-600 font-semibold text-sm sm:text-base">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{vacante.salaryMin} - {vacante.salaryMax}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 sm:line-clamp-3">
              {vacante.description}
            </p>
          </div>

          {/* Job Image - Right Column */}
          {vacante.imageUrl && (
            <div className="lg:col-span-1">
              <ExpandableImage
                src={`/${vacante.imageUrl}`}
                alt={`Imagen de ${vacante.title}`}
                containerClassName="relative w-full h-24 sm:h-32 lg:h-36 rounded-lg overflow-hidden bg-gray-100 border"
                objectFit="contain"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
          {isAuthenticated && hasApplied ? (
            <Button
              className="flex-1 text-sm"
              variant="outline"
              disabled
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Ya aplicaste
            </Button>
          ) : (
            <Button
              className="flex-1 text-sm"
              onClick={() => onApply?.(vacante.id)}
              size="sm"
            >
              Postularme
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onViewDetails?.(vacante)}
            className="sm:w-auto text-sm"
            size="sm"
          >
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
