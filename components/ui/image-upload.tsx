'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (imageUrl: string) => void
  onImageDeleted: () => void
  uploadEndpoint: string
  deleteEndpoint: string
  maxSizeMB?: number
  acceptedTypes?: string[]
  label?: string
  description?: string
}

export function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  uploadEndpoint,
  deleteEndpoint,
  maxSizeMB = 2,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  label = 'Imagen',
  description = 'Sube una imagen para mejorar la presentación'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Solo se permiten archivos: ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onImageUploaded(data.data.imageUrl)
        toast.success(data.message || 'Imagen subida correctamente')
      } else {
        toast.error(data.error || 'Error al subir la imagen')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error al subir la imagen')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        onImageDeleted()
        toast.success(data.message || 'Imagen eliminada correctamente')
      } else {
        toast.error(data.error || 'Error al eliminar la imagen')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Error al eliminar la imagen')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Card>
        <CardContent className="p-4">
          {currentImageUrl ? (
            <div className="space-y-4">
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={`/${currentImageUrl}`}
                  alt="Imagen actual"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || deleting}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar imagen
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={uploading || deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir imagen
                  </>
                )}
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Formatos permitidos: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}.
        Tamaño máximo: {maxSizeMB}MB.
      </p>
    </div>
  )
}