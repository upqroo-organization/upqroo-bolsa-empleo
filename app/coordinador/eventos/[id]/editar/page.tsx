/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Calendar, ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { EventType, EventTypeLabels, UpdateEventData, Event } from "@/types/events";
import { toast } from "sonner";
import StateSelectClient from "@/components/StateSelectClient";

interface EditCoordinatorEventPageProps {
  params: {
    id: string;
  };
}

export default function EditCoordinatorEventPage({ params }: EditCoordinatorEventPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<UpdateEventData>({});

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/coordinador/events/${params.id}`);
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
        if (eventData.imageUrl) {
          setImagePreview(eventData.imageUrl);
        }
      } else {
        toast.error(data.message || 'Error al cargar evento');
        router.push('/coordinador/eventos');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Error al cargar evento');
      router.push('/coordinador/eventos');
    } finally {
      setFetchLoading(false);
    }
  };

  const validateAndSetImage = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSetImage(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetImage(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(event?.imageUrl || null);
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', imageFile);

    try {
      const response = await fetch(`/api/coordinador/events/${params.id}/upload-image`, {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Error uploading image:', data.message);
        toast.error('Error al subir la imagen, pero el evento fue actualizado');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen, pero el evento fue actualizado');
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
      const response = await fetch(`/api/coordinador/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // If there's a new image, upload it
        if (imageFile) {
          await uploadImage();
        }

        toast.success('Evento actualizado exitosamente');
        router.push('/coordinador/eventos');
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

  const handleInputChange = (field: keyof UpdateEventData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        <p className="text-muted-foreground">Evento no encontrado</p>
        <Link href="/coordinador/eventos">
          <Button className="mt-4">Volver a Eventos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/coordinador/eventos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Evento Institucional</h1>
          <p className="text-muted-foreground">
            Actualiza la información del evento
          </p>
        </div>
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Imagen del Evento (Opcional)
          </CardTitle>
          <CardDescription>
            Sube una imagen representativa para tu evento (máximo 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                <p className="text-sm text-muted-foreground mb-2">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP hasta 5MB
                </p>
              </div>
            )}

            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {!imagePreview && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar Imagen
                </Button>
              </div>
            )}
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
            Actualiza la información básica de tu evento institucional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Evento *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Feria de Empleo UPQROO 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Tipo de Evento *</Label>
                <Select
                  value={formData.eventType || ''}
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
                placeholder="Describe el evento, objetivos, agenda, etc."
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
                  checked={formData.isOnline || false}
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
                      placeholder="Ej: Auditorio UPQROO, Campus Principal..."
                      required={!formData.isOnline}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <StateSelectClient
                      name="state"
                      value={formData.stateId?.toString() || 'none'}
                      onValueChange={(value) => handleInputChange('stateId', value === 'none' ? undefined : parseInt(value))}
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
                  placeholder="Ej: 200"
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

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Evento activo</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Link href="/coordinador/eventos">
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