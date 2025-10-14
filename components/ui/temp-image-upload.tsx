'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface TempImageUploadProps {
  onImageSelected: (file: File | null) => void
  maxSizeMB?: number
  acceptedTypes?: string[]
  label?: string
  description?: string
}

export function TempImageUpload({
  onImageSelected,
  maxSizeMB = 2,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  label = 'Imagen',
  description = 'Sube una imagen para mejorar la presentación'
}: TempImageUploadProps) {
  const [, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setSelectedFile(file)
    onImageSelected(file)
  }

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setSelectedFile(null)
    onImageSelected(null)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Card>
        <CardContent className="p-4">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={previewUrl}
                  alt="Vista previa de la imagen"
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
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar imagen
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4 mr-2" />
                  Eliminar
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
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir imagen
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