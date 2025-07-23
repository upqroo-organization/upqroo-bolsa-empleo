'use client';

import { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, Download, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface CVUploadModalProps {
  trigger?: React.ReactNode;
}

export default function CVUploadModal({ trigger }: CVUploadModalProps) {
  const { user, updateUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvDeleting, setCvDeleting] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CV upload handlers
  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setCvError('Solo se permiten archivos PDF');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setCvError('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setCvError(null);
    setCvUploading(true);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/usuarios/me/cv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update user data in the hook
        await updateUser({ name: user?.name || '', username: user?.username || '' });
        setCvError(null);
        // Close modal after successful upload
        setTimeout(() => setOpen(false), 1000);
      } else {
        setCvError(result.error || 'Error al subir el CV');
      }
    } catch (error) {
      setCvError('Error al subir el CV');
      console.error('CV upload error:', error);
    } finally {
      setCvUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCVDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu CV?')) {
      return;
    }

    setCvDeleting(true);
    setCvError(null);

    try {
      const response = await fetch('/api/usuarios/me/cv', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Update user data in the hook
        await updateUser({ name: user?.name || '', username: user?.username || '' });
        setCvError(null);
      } else {
        setCvError(result.error || 'Error al eliminar el CV');
      }
    } catch (error) {
      setCvError('Error al eliminar el CV');
      console.error('CV delete error:', error);
    } finally {
      setCvDeleting(false);
    }
  };

  const handleCVDownload = () => {
    if (user?.cvUrl) {
      // Extract filename from the cvUrl path
      const filename = user.cvUrl.split('/').pop();
      if (filename) {
        window.open(`/api/uploads/cvs/${filename}`, '_blank');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Actualizar CV
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Currículum Vitae (CV)</DialogTitle>
          <DialogDescription>
            Sube tu CV en formato PDF para que las empresas puedan conocerte mejor.
            Solo se permite un archivo por usuario.
          </DialogDescription>
        </DialogHeader>

        {cvError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{cvError}</AlertDescription>
          </Alert>
        )}

        {user?.cvUrl ? (
          // CV exists - show current CV with actions
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium">CV Actual</p>
                  <p className="text-sm text-gray-600">
                    Subido el {new Date(user.updatedAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCVDownload}
                  disabled={cvUploading || cvDeleting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Ver CV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCVDelete}
                  disabled={cvUploading || cvDeleting}
                  className="text-red-600 hover:text-red-700"
                >
                  {cvDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // No CV - show upload area
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No has subido tu CV aún</p>
            <p className="text-sm text-gray-500 mb-4">
              Sube tu currículum en formato PDF para que las empresas puedan conocerte mejor
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleCVUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={cvUploading || cvDeleting}
            className="w-full"
          >
            {cvUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo CV...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {user?.cvUrl ? 'Reemplazar CV' : 'Subir CV'}
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center sm:hidden">
            Solo archivos PDF • Máximo 5MB
          </p>
        </DialogFooter>
        <p className="text-xs text-gray-500 text-center hidden sm:block">
          Solo archivos PDF • Máximo 5MB
        </p>
      </DialogContent>
    </Dialog>
  );
}