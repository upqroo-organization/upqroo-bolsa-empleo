"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import EventImage from "@/components/EventImage"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Building2,
  CalendarDays,
  Play,
  Pause
} from "lucide-react"
import { Event, EventTypeLabels } from "@/types/events"
import { format, isAfter } from "date-fns"
import { es } from "date-fns/locale"

interface FeaturedEventsCarouselProps {
  events: Event[]
}

export default function FeaturedEventsCarousel({ events }: FeaturedEventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [windowWidth, setWindowWidth] = useState(0)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize() // Set initial width
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Number of cards to show per view based on screen size
  const getCardsPerView = useCallback(() => {
    if (windowWidth >= 1024) return 3 // lg and above
    if (windowWidth >= 768) return 2  // md and above
    return 1 // mobile
  }, [windowWidth])

  // Calculate total slides
  const getTotalSlides = useCallback(() => {
    const cardsPerView = getCardsPerView()
    return Math.max(1, events.length - cardsPerView + 1)
  }, [events.length, getCardsPerView])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || events.length <= getCardsPerView()) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const totalSlides = getTotalSlides()
        return prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
      })
    }, 6000) // Change slide every 6 seconds (slower for events)

    return () => clearInterval(interval)
  }, [isAutoPlaying, events.length, getCardsPerView, getTotalSlides])

  const nextSlide = useCallback(() => {
    const totalSlides = getTotalSlides()
    setCurrentIndex((prevIndex) =>
      prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
    )
  }, [getTotalSlides])

  const prevSlide = useCallback(() => {
    const totalSlides = getTotalSlides()
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? totalSlides - 1 : prevIndex - 1
    )
  }, [getTotalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Reset to first slide when screen size changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [windowWidth])

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold mb-4">No hay eventos próximos</h3>
          <p className="text-muted-foreground mb-8">
            Actualmente no hay eventos programados. Te invitamos a registrarte para recibir
            notificaciones cuando se publiquen nuevos eventos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Registrarse para Notificaciones
            </Button>
            <Button variant="outline" size="lg">
              Explorar Eventos Pasados
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const cardsPerView = getCardsPerView()
  const totalSlides = getTotalSlides()
  const showNavigation = events.length > cardsPerView

  return (
    <div className="relative">
      {/* Carousel Header with Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Mostrando {Math.min(events.length, 10)} eventos próximos
        </div>
        {showNavigation && (
          <div className="flex items-center gap-2">
            {/* Play/Pause button removed */}
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden rounded-lg"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Responsive Carousel */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className={`flex-shrink-0 px-3 ${cardsPerView === 1 ? 'w-full' :
                cardsPerView === 2 ? 'w-1/2' : 'w-1/3'
                }`}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={prevSlide}
            disabled={currentIndex === 0 && !isAutoPlaying}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1 && !isAutoPlaying}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showNavigation && totalSlides > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                ? 'bg-primary scale-110'
                : 'bg-gray-300 hover:bg-gray-400'
                }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar removed */}

      {/* Event Counter and Navigation Info removed */}
    </div>
  )
}

// Event Card Component
function EventCard({ event }: { event: Event }) {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <CardHeader className="pb-2 space-y-2">
        {event.imageUrl && (
          <Dialog>
            <DialogTrigger asChild>
              <div className={`w-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${!event.title && !event.description ? 'h-48' : 'h-32'
                }`}>
                <EventImage
                  src={event.imageUrl}
                  alt={event.title || 'Imagen del evento'}
                  className="w-full h-full object-cover bg-muted"
                  containerClassName="w-full h-full"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-0">
              <div className="relative w-full max-h-[90vh] overflow-auto">
                <EventImage
                  src={event.imageUrl}
                  alt={event.title || 'Imagen del evento'}
                  className="w-full h-auto"
                  containerClassName="w-full min-h-[200px]"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {(event.title || event.description || event.eventType) && (
          <div className="space-y-2">
            {event.title && (
              <CardTitle className="text-lg line-clamp-2">
                {event.title}
              </CardTitle>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <CardDescription className="flex items-center gap-1 text-sm">
                <Building2 className="h-4 w-4" />
                {event.company?.name || (event.coordinator ? 'UPQROO' : 'Organizador')}
              </CardDescription>
              {event.eventType && (
                <Badge variant="secondary" className="text-xs">
                  {EventTypeLabels[event.eventType as keyof typeof EventTypeLabels]}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-2 flex-1 flex flex-col">
        <div className="space-y-2 text-sm">
          {event.startDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {format(new Date(event.startDate), "PP", { locale: es })}
                {event.endDate && isAfter(new Date(event.endDate), new Date(event.startDate)) && (
                  <> - {format(new Date(event.endDate), "PP", { locale: es })}</>
                )}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {event.isOnline ? "En línea" : event.location || "Por definir"}
              {event.state && !event.isOnline && ` - ${event.state.name}`}
            </span>
          </div>

          {event.maxAttendees && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>Máx. {event.maxAttendees} asistentes</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {event.description}
          </p>
        )}

        {event.registrationUrl && (
          <div className="mt-auto pt-2">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Registrarse
              </Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}