'use client'

import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function EventImage({ src, alt, className, containerClassName }: EventImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${containerClassName || ''}`}>
        <div className="text-center text-muted-foreground p-4">
          <ImageOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
