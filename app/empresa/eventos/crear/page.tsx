/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react';
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
import { EventType, EventTypeLabels, CreateEventData } from "@/types/events";
import { toast } from "sonner";
import StateSelectClient from "@/components/StateSelectClient";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    eventType: EventType.ANNOUNCEMENT,
    startDate: undefined,
    endDate: undefined,
    location: '',
    isOnline: false,
    maxAttendees: undefined,
    registrationUrl: '',
    stateId: undefined
  });

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
    setImagePreview(null);
  };

  const uploadImage = async (eventId: string) => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`/api/empresa/events/${eventId}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Error uploading image:', data.message);
        toast.error('Error al subir la imagen, pero el evento fue creado');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen, pero el evento fue creado');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Either image is uploaded OR all required fields are filled
    const hasImage = !!imageFile;
    const hasRequiredFields = formData.title && formData.description && formData.eventType && (formData.isOnline || formData.location);

    if (!hasImage && !hasRequiredFields) {
      toast.error('Por favor sube una imagen o completa todos los campos requeridos (título, descripción, tipo de evento y ubicación)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/empresa/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // If there's an image, upload it
        if (imageFile) {
          await uploadImage(data.data.id);
        }

        toast.success('Evento creado exitosamente');
        router.push('/empresa/eventos');
      } else {
        toast.error(data.message || 'Error al crear evento');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error al crear evento');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateEventData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          <h1 className="text-3xl font-bold">Crear Evento</h1>
          <p className="text-muted-foreground">
            Crea un nuevo evento para tu empresa
          </p>
        </div>
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Imagen del Evento
          </CardTitle>
          <CardDescription>
            Sube una imagen representativa para tu evento (máximo 5MB). Si subes una imagen, los demás campos son opcionales.
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
            Completa la información básica de tu evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Evento</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Bootcamp de Desarrollo Web"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Tipo de Evento</Label>
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
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu evento, objetivos, agenda, etc."
                rows={4}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio (Opcional)</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate ? formData.startDate.toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
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
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ej: Centro de Convenciones, Auditorio..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado (Opcional)</Label>
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
                    Creando...
                  </>
                ) : (
                  'Crear Evento'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}