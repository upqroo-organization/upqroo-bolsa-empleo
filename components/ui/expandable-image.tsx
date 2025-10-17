'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Expand, X } from 'lucide-react'

interface ExpandableImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  showExpandButton?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export function ExpandableImage({
  src,
  alt,
  className = "",
  containerClassName = "relative w-full h-48 rounded-lg overflow-hidden bg-gray-100",
  showExpandButton = true,
  objectFit = 'contain'
}: ExpandableImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={containerClassName}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Imagen no disponible</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className={containerClassName}>
        <DialogTrigger asChild>
          <div className="relative w-full h-full cursor-pointer group">
            <Image
              src={src}
              alt={alt}
              fill
              className={`${className} transition-transform group-hover:scale-105`}
              style={{ objectFit }}
              onError={() => setImageError(true)}
            />
            {showExpandButton && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Expand className="h-4 w-4 mr-2" />
                  Ver imagen completa
                </Button>
              </div>
            )}
          </div>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative w-full h-full">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="relative w-full h-[80vh]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}