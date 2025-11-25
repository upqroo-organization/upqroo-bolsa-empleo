'use client'

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventImage from "@/components/EventImage";

interface State {
  id: number;
  name: string;
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Building2,
  Loader2,
  CalendarDays,
  Search,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { EventTypeLabels } from "@/types/events";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [states, setStates] = useState<State[]>([]);
  const [statesLoading, setStatesLoading] = useState(true);

  const { events, loading, error, pagination } = useEvents({
    limit: 12,
    page: currentPage,
    eventType: selectedEventType === 'all' ? undefined : selectedEventType,
    stateId: selectedState === 'all' ? undefined : selectedState,
    upcoming: showUpcomingOnly
  });

  // Filter events by search term (client-side)
  const filteredEvents = events.filter(event =>
    (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.company?.name || event.coordinator?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        const data = await response.json();
        if (data.success) {
          setStates(data.data);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setStatesLoading(false);
      }
    };

    fetchStates();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Eventos y Oportunidades
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Descubre talleres, conferencias, ferias de empleo, anuncios y oportunidades de networking
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar eventos</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por título, descripción o empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium">Tipo de evento</label>
                  <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                    <SelectTrigger className='w-full'>
                      <SelectValue className='w-full' placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {Object.entries(EventTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      {!statesLoading && states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Filtro temporal</label>
                  <Select
                    value={showUpcomingOnly ? 'upcoming' : 'all'}
                    onValueChange={(value) => setShowUpcomingOnly(value === 'upcoming')}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Próximos y sin fecha</SelectItem>
                      <SelectItem value="all">Todos los eventos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Cargando eventos...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-2xl font-semibold mb-4">No se encontraron eventos</h3>
                <p className="text-muted-foreground mb-8">
                  No hay eventos que coincidan con tus criterios de búsqueda.
                  Intenta ajustar los filtros.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedEventType('all');
                    setSelectedState('all');
                    setShowUpcomingOnly(true);
                  }}
                  variant="outline"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
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

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}