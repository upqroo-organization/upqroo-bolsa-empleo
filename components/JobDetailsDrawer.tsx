import { VacanteInterface, VacanteModalityEnum, VacanteTypeEnum, Careers } from "@/types/vacantes"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Clock, DollarSign, Share2, Calendar, Users, CheckCircle } from "lucide-react"
import { getEnumLabelSafe } from "@/utils"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'
import { ExpandableImage } from "@/components/ui/expandable-image"

dayjs.extend(relativeTime)
dayjs.locale('es')

interface JobDetailsDrawerProps {
  vacante: VacanteInterface | null
  hasApplied?: boolean
  isAuthenticated?: boolean
  isOpen: boolean
  onClose: () => void
  onApply: (vacanteId: string) => void
  onShare: (vacante: VacanteInterface) => void
}

export default function JobDetailsDrawer({
  vacante,
  hasApplied = false,
  isAuthenticated = false,
  isOpen,
  onClose,
  onApply,
  onShare
}: JobDetailsDrawerProps) {
  if (!vacante) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full !sm:w-[540px] !max-w-[70vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{vacante.title}</SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              {vacante.company.name}
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {vacante.location} - {vacante?.state?.name || ''}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dayjs(vacante.updatedAt).fromNow()}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {vacante.type && (
                <Badge variant="secondary">
                  {getEnumLabelSafe(VacanteTypeEnum, vacante.type)}
                </Badge>
              )}
              {vacante.modality && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {getEnumLabelSafe(VacanteModalityEnum, vacante.modality)}
                </Badge>
              )}
              {vacante.career && (
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {getEnumLabelSafe(Careers, vacante.career)}
                </Badge>
              )}
            </div>

            {(vacante.salaryMin || vacante.salaryMax) && (
              <div className="flex items-center gap-1 text-green-600 font-semibold">
                <DollarSign className="h-4 w-4" />
                {vacante.salaryMin && vacante.salaryMax
                  ? `$${vacante.salaryMin.toLocaleString()} - $${vacante.salaryMax.toLocaleString()}`
                  : vacante.salaryMin
                    ? `Desde $${vacante.salaryMin.toLocaleString()}`
                    : `Hasta $${vacante.salaryMax?.toLocaleString()}`
                }
              </div>
            )}
          </div>

          <Separator />

          {/* Content Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              {vacante.summary && (
                <div>
                  <h3 className="font-semibold mb-2">Resumen</h3>
                  <p className="text-sm text-gray-700">{vacante.summary}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Descripción del puesto</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{vacante.description}</p>
              </div>

              {/* Responsibilities */}
              {vacante.responsibilities && (
                <div>
                  <h3 className="font-semibold mb-2">Responsabilidades</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{vacante.responsibilities}</p>
                </div>
              )}
            </div>

            {/* Job Image - Right Column */}
            {vacante.imageUrl && (
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <ExpandableImage
                    src={`/${vacante.imageUrl}`}
                    alt={`Imagen de ${vacante.title}`}
                    containerClassName="relative w-full h-48 lg:h-64 rounded-lg overflow-hidden bg-gray-100 border"
                    objectFit="contain"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-3">
            {vacante.numberOfPositions && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Vacantes disponibles:</span>
                <span className="font-medium">{vacante.numberOfPositions}</span>
              </div>
            )}

            {vacante.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Fecha límite:</span>
                <span className="font-medium">{dayjs(vacante.deadline).format('DD/MM/YYYY')}</span>
              </div>
            )}

            {vacante.department && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Departamento:</span>
                <span className="font-medium">{vacante.department}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {isAuthenticated && hasApplied ? (
              <Button
                className="flex-1"
                variant="outline"
                disabled
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Ya aplicaste
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={() => onApply(vacante.id)}
              >
                Postularme
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onShare(vacante)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
