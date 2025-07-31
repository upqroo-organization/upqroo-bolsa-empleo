/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react';
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
  Clock,
  Loader2,
  CalendarDays,
  Search,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { EventTypeLabels } from "@/types/events";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import StateSelectClient from "@/components/StateSelectClient";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { events, loading, error, pagination } = useEvents({
    limit: 12,
    page: currentPage,
    eventType: selectedEventType || undefined,
    stateId: selectedState || undefined,
    upcoming: showUpcomingOnly
  });

  // Filter events by search term (client-side)
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Eventos y Oportunidades
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Descubre talleres, conferencias, ferias de empleo y oportunidades de networking
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de evento</label>
                  <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los tipos</SelectItem>
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
                  <StateSelectClient
                    name="state"
                    value={selectedState}
                    onValueChange={setSelectedState}
                    placeholder="Todos los estados"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Filtro temporal</label>
                  <Select 
                    value={showUpcomingOnly ? 'upcoming' : 'all'} 
                    onValueChange={(value) => setShowUpcomingOnly(value === 'upcoming')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Solo próximos</SelectItem>
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
                    setSelectedEventType('');
                    setSelectedState('');
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
                  <Card key={event.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      {event.imageUrl && (
                        <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 mb-2">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mb-2">
                            <Building2 className="h-4 w-4" />
                            {event.company.name}
                          </CardDescription>
                          <Badge variant="secondary" className="mb-2">
                            {EventTypeLabels[event.eventType as keyof typeof EventTypeLabels]}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(event.startDate), "PPP", { locale: es })}
                            {event.endDate && isAfter(new Date(event.endDate), new Date(event.startDate)) && (
                              <> - {format(new Date(event.endDate), "PPP", { locale: es })}</>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(event.startDate), "p", { locale: es })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {event.isOnline ? "En línea" : event.location || "Por definir"}
                            {event.state && !event.isOnline && ` - ${event.state.name}`}
                          </span>
                        </div>

                        {event.maxAttendees && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Máximo {event.maxAttendees} asistentes</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                      
                      {event.registrationUrl ? (
                        <a 
                          href={event.registrationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Registrarse
                          </Button>
                        </a>
                      ) : (
                        <Button className="w-full" disabled>
                          Más información próximamente
                        </Button>
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