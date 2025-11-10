/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Event, EventTypeLabels } from "@/types/events";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CoordinatorEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coordinador/events');
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.message || 'Error al cargar eventos');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/coordinador/events/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Evento eliminado exitosamente');
        fetchEvents(); // Refresh the list
      } else {
        toast.error(data.message || 'Error al eliminar evento');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Error al eliminar evento');
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/coordinador/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Evento ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
        fetchEvents(); // Refresh the list
      } else {
        toast.error(data.message || 'Error al actualizar evento');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Error al actualizar evento');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando eventos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Error al cargar eventos</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchEvents} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
          <p className="text-muted-foreground">
            Administra los eventos institucionales de UPQROO
          </p>
        </div>
        <Link href="/coordinador/eventos/crear">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Evento
          </Button>
        </Link>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No tienes eventos</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer evento institucional para conectar con estudiantes y empresas
            </p>
            <Link href="/coordinador/eventos/crear">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Evento
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {EventTypeLabels[event.eventType as keyof typeof EventTypeLabels]}
                      </Badge>
                      <Badge variant={event.isActive ? "default" : "destructive"}>
                        {event.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                  {event.imageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 ml-3">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('es-ES')}
                      {event.endDate && (
                        <> - {new Date(event.endDate).toLocaleDateString('es-ES')}</>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {event.isOnline ? "En línea" : event.location || "Por definir"}
                      {event.state && !event.isOnline && ` - ${event.state.name}`}
                    </span>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Máximo {event.maxAttendees} asistentes</span>
                    </div>
                  )}

                  {event.registrationUrl && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <ExternalLink className="h-4 w-4" />
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Enlace de registro
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/coordinador/eventos/${event.id}/editar`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEventStatus(event.id, event.isActive)}
                  >
                    {event.isActive ? "Desactivar" : "Activar"}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El evento será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}