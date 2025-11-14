'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventImage from "@/components/EventImage";
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Building2,
  Loader2,
  CalendarDays
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { EventTypeLabels } from "@/types/events";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default function FeaturedEvents() {
  const { events, loading, error } = useEvents({
    limit: 6,
    upcoming: true
  });

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground">
              Descubre eventos, talleres y oportunidades de networking
            </p>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando eventos...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground">
              Descubre eventos, talleres y oportunidades de networking
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground">
              Descubre eventos, talleres y oportunidades de networking
            </p>
          </div>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-4">No hay eventos próximos</h3>
              <p className="text-muted-foreground mb-8">
                Actualmente no hay eventos programados. Te invitamos a registrarte para recibir
                notificaciones cuando se publiquen nuevos eventos.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
          <p className="text-xl text-muted-foreground">
            Descubre eventos actuales, futuros y anuncios importantes
          </p>
        </div>

        {/* Desktop: Show 3 cards in grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {events.slice(0, 3).map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <CardHeader className="pb-2 space-y-2">
                {event.imageUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className={`w-full rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${!event.title && !event.description ? 'h-96' : 'h-40'
                        }`}>
                        <EventImage
                          src={event.imageUrl}
                          alt={event.title || 'Imagen del evento'}
                          className="w-full h-full object-contain bg-muted"
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
                  <div className="space-y-1">
                    {event.title && (
                      <CardTitle className="text-base line-clamp-2">
                        {event.title}
                      </CardTitle>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <Building2 className="h-3 w-3" />
                        {event.company?.name || (event.coordinator ? 'UPQROO' : 'Organizador')}
                      </CardDescription>
                      {event.eventType && (
                        <Badge variant="secondary" className="text-xs py-0 h-5">
                          {EventTypeLabels[event.eventType as keyof typeof EventTypeLabels]}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-2 pt-2 flex-1">
                <div className="space-y-1.5 text-xs">
                  {event.startDate && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {format(new Date(event.startDate), "PP", { locale: es })}
                        {event.endDate && isAfter(new Date(event.endDate), new Date(event.startDate)) && (
                          <> - {format(new Date(event.endDate), "PP", { locale: es })}</>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {event.isOnline ? "En línea" : event.location || "Por definir"}
                      {event.state && !event.isOnline && ` - ${event.state.name}`}
                    </span>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3 w-3 flex-shrink-0" />
                      <span>Máx. {event.maxAttendees}</span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}

                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-auto"
                  >
                    <Button size="sm" className="w-full">
                      <ExternalLink className="mr-1.5 h-3 w-3" />
                      Registrarse
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ width: `${events.slice(0, 3).length * 280}px` }}>
              {events.slice(0, 3).map((event) => (
                <Card key={event.id} className="flex-shrink-0 w-64 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    {event.imageUrl && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className={`w-full rounded-lg overflow-hidden mb-3 cursor-pointer hover:opacity-90 transition-opacity ${!event.title && !event.description ? 'h-64' : 'h-32'
                            }`}>
                            <EventImage
                              src={event.imageUrl}
                              alt={event.title || 'Imagen del evento'}
                              className="w-full h-full object-contain bg-muted"
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
                      <>
                        {event.title && (
                          <CardTitle className="text-lg line-clamp-2 mb-2">
                            {event.title}
                          </CardTitle>
                        )}
                        <CardDescription className="flex items-center gap-1 mb-2">
                          <Building2 className="h-4 w-4" />
                          {event.company?.name || (event.coordinator ? 'UPQROO' : 'Organizador')}
                        </CardDescription>
                        {event.eventType && (
                          <Badge variant="secondary" className="mb-2">
                            {EventTypeLabels[event.eventType as keyof typeof EventTypeLabels]}
                          </Badge>
                        )}
                      </>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-2 pt-2 text-[10px]">
                    <div className="space-y-1">
                      {event.startDate && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {format(new Date(event.startDate), "PP", { locale: es })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {event.isOnline ? "En línea" : event.location || "Por definir"}
                        </span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {event.registrationUrl && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button size="sm" className="w-full text-xs h-7">
                          <ExternalLink className="mr-1 h-2.5 w-2.5" />
                          Registrarse
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/eventos">
            <Button variant="outline" size="lg">
              Ver Más Eventos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}