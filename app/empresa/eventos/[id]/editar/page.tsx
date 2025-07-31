/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Event, EventType, EventTypeLabels, UpdateEventData } from "@/types/events";
import { toast } from "sonner";
import StateSelectClient from "@/components/StateSelectClient";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<UpdateEventData>({});

  const fetchEvent = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/empresa/events/${eventId}`);
      const data = await response.json();

      if (data.success) {
        const eventData = data.data;
        setEvent(eventData);
        setFormData({
          title: eventData.title,
          description: eventData.description,
          eventType: eventData.eventType,
          startDate: new Date(eventData.startDate),
          endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
          location: eventData.location,
          isOnline: eventData.isOnline,
          maxAttendees: eventData.maxAttendees,
          registrationUrl: eventData.registrationUrl,
          stateId: eventData.stateId,
          isActive: eventData.isActive
        });
      } else {
        toast.error(data.message || 'Error al cargar evento');
        router.push('/empresa/eventos');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Error al cargar evento');
      router.push('/empresa/eventos');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.eventType) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (!formData.isOnline && !formData.location) {
      toast.error('Por favor especifica la ubicación del evento o marca como evento en línea');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/empresa/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Evento actualizado exitosamente');
        router.push('/empresa/eventos');
      } else {
        toast.error(data.message || 'Error al actualizar evento');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Error al actualizar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadLoading(true);

    try {
      const response = await fetch(`/api/empresa/events/${eventId}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setEvent(data.data);
        toast.success('Imagen subida exitosamente');
      } else {
        toast.error(data.message || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir imagen');
    } finally {
      setUploadLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof UpdateEventData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchEvent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (fetchLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando evento...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6 text-center">
        <p>Evento no encontrado</p>
        <Link href="/empresa/eventos">
          <Button className="mt-4">Volver a Eventos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/empresa/eventos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Evento</h1>
          <p className="text-muted-foreground">
            Actualiza la información de tu evento
          </p>
        </div>
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Imagen del Evento</CardTitle>
          <CardDescription>
            Sube una imagen representativa para tu evento (máximo 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event.imageUrl && (
              <div className="relative w-full max-w-md">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadLoading}
                className="max-w-md"
              />
              {uploadLoading && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subiendo imagen...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información del Evento
          </CardTitle>
          <CardDescription>
            Actualiza la información de tu evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Evento activo</Label>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Evento *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Bootcamp de Desarrollo Web"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Tipo de Evento *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => handleInputChange('eventType', value as EventType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EventTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu evento, objetivos, agenda, etc."
                rows={4}
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => handleInputChange('startDate', new Date(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin (Opcional)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => handleInputChange('isOnline', checked)}
                />
                <Label htmlFor="isOnline">Evento en línea</Label>
              </div>

              {!formData.isOnline && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ej: Centro de Convenciones, Auditorio..."
                      required={!formData.isOnline}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <StateSelectClient
                      name="state"
                      value={formData.stateId?.toString() || ''}
                      onValueChange={(value) => handleInputChange('stateId', value ? parseInt(value) : undefined)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Máximo de Asistentes (Opcional)</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  value={formData.maxAttendees || ''}
                  onChange={(e) => handleInputChange('maxAttendees', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Ej: 50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationUrl">URL de Registro (Opcional)</Label>
                <Input
                  id="registrationUrl"
                  type="url"
                  value={formData.registrationUrl || ''}
                  onChange={(e) => handleInputChange('registrationUrl', e.target.value)}
                  placeholder="https://ejemplo.com/registro"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Link href="/empresa/eventos">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Evento'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}