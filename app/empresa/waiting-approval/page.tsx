'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Clock, AlertCircle, Upload, FileText, Trash2, Download, CheckCircle } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function WaitingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fiscal document upload state
  const [fiscalUploading, setFiscalUploading] = useState(false);
  const [fiscalDeleting, setFiscalDeleting] = useState(false);
  const [fiscalError, setFiscalError] = useState<string | null>(null);
  const fiscalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkCompanyStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/company/me');
        const data = await response.json();

        if (data.success) {
          setCompany(data.data);
          
          // If company is approved, redirect to dashboard
          if (data.data.isApprove) {
            router.push('/empresa');
          }
        } else {
          setError(data.error || 'Error al cargar información de la empresa');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'company') {
      checkCompanyStatus();
    } else if (status === 'authenticated' && session?.user?.role !== 'company') {
      router.push('/redirect');
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  // Fiscal document upload handlers
  const handleFiscalUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFiscalError('Solo se permiten archivos PDF, JPG, PNG o WEBP');
      toast.error('Formato no válido', {
        description: 'Solo se permiten documentos en formato PDF o imágenes JPG, PNG, WEBP'
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFiscalError('El archivo es demasiado grande. Máximo 10MB');
      toast.error('Archivo muy grande', {
        description: 'El archivo debe ser menor a 10MB. Comprime el documento e intenta nuevamente.'
      });
      return;
    }

    setFiscalError(null);
    setFiscalUploading(true);

    try {
      const formData = new FormData();
      formData.append('fiscalDocument', file);

      const response = await fetch('/api/company/fiscal-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setCompany(result.data);
        toast.success('Documento subido', {
          description: result.message || 'Tu constancia de situación fiscal ha sido subida correctamente'
        });
      } else {
        setFiscalError(result.error || 'Error al subir el documento');
        toast.error('Error al subir documento', {
          description: result.error || 'No se pudo subir tu constancia fiscal. Intenta nuevamente.'
        });
      }
    } catch (error) {
      setFiscalError('Error al subir el documento');
      toast.error('Error de conexión', {
        description: 'No se pudo conectar con el servidor. Verifica tu conexión.'
      });
      console.error('Fiscal document upload error:', error);
    } finally {
      setFiscalUploading(false);
      // Reset file input
      if (fiscalInputRef.current) {
        fiscalInputRef.current.value = '';
      }
    }
  };

  const handleFiscalDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu constancia de situación fiscal? Esta acción no se puede deshacer.')) {
      return;
    }

    setFiscalDeleting(true);
    setFiscalError(null);

    try {
      const response = await fetch('/api/company/fiscal-document', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setCompany(result.data);
        toast.success('Documento eliminado', {
          description: result.message || 'Tu constancia fiscal ha sido eliminada correctamente'
        });
      } else {
        setFiscalError(result.error || 'Error al eliminar el documento');
        toast.error('Error al eliminar documento', {
          description: result.error || 'No se pudo eliminar tu constancia fiscal. Intenta nuevamente.'
        });
      }
    } catch (error) {
      setFiscalError('Error al eliminar el documento');
      toast.error('Error de conexión', {
        description: 'No se pudo conectar con el servidor. Verifica tu conexión.'
      });
      console.error('Fiscal document delete error:', error);
    } finally {
      setFiscalDeleting(false);
    }
  };

  const handleFiscalDownload = () => {
    if (company?.fiscalDocumentUrl) {
      const filename = company.fiscalDocumentUrl.split('/').pop();
      if (filename) {
        window.open(`/api/uploads/fiscal-documents/${filename}`, '_blank');
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center text-red-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Intentar nuevamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader className="text-center bg-yellow-50 border-b border-yellow-100">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center">
            <Clock className="h-8 w-8 text-yellow-700" />
          </div>
          <CardTitle className="text-2xl text-yellow-800">Cuenta en Revisión</CardTitle>
          <CardDescription className="text-yellow-700">
            Tu empresa está pendiente de aprobación
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              ¡Gracias por registrar tu empresa!
            </h2>
            <p className="text-gray-600">
              Hemos recibido tu solicitud para {company?.name} y está siendo revisada por nuestro equipo de coordinación.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">¿Qué sigue?</h3>
            <ol className="space-y-3 text-blue-700">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <span className="block h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
                </div>
                <span>Nuestro equipo está revisando la información de tu empresa</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <span className="block h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
                </div>
                <span>Recibirás un correo electrónico cuando tu cuenta sea aprobada</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <span className="block h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
                </div>
                <span>Una vez aprobada, podrás publicar vacantes y acceder a todas las funciones</span>
              </li>
            </ol>
          </div>

          {/* Fiscal Document Section */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Constancia de Situación Fiscal
              </CardTitle>
              <CardDescription className="text-green-700">
                Sube tu constancia de situación fiscal para acelerar el proceso de aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fiscalError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fiscalError}</AlertDescription>
                </Alert>
              )}

              {company?.fiscalDocumentUrl ? (
                // Document exists - show current document with actions
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Documento Subido</p>
                        <p className="text-sm text-green-600">
                          <CheckCircle className="inline h-4 w-4 mr-1" />
                          Tu constancia fiscal está disponible para revisión
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFiscalDownload}
                        disabled={fiscalUploading || fiscalDeleting}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFiscalDelete}
                        disabled={fiscalUploading || fiscalDeleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        {fiscalDeleting ? (
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
                // No document - show upload area
                <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-white">
                  <FileText className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-700 mb-2">Sube tu constancia de situación fiscal</p>
                  <p className="text-sm text-green-600 mb-4">
                    Este documento ayudará a acelerar el proceso de validación de tu empresa
                  </p>
                </div>
              )}

              {/* Upload button - always visible */}
              <div className="flex flex-col items-center gap-2 mt-4">
                <input
                  ref={fiscalInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFiscalUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fiscalInputRef.current?.click()}
                  disabled={fiscalUploading || fiscalDeleting}
                  variant={company?.fiscalDocumentUrl ? "outline" : "default"}
                  className="w-full sm:w-auto"
                >
                  {fiscalUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Subiendo documento...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {company?.fiscalDocumentUrl ? 'Reemplazar Documento' : 'Subir Constancia Fiscal'}
                    </>
                  )}
                </Button>
                <p className="text-xs text-green-600 text-center">
                  Formatos: PDF, JPG, PNG, WEBP • Máximo 10MB
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="border-t pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p>Fecha de solicitud: {company?.createdAt ? new Date(company.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Cargando...'}</p>
                <p>Tiempo estimado de respuesta: 1-2 días hábiles</p>
              </div>
              <Button variant="outline" onClick={() => signOut()}>
                Cerrar Sesión
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mt-4">
            <p>
              Si tienes alguna pregunta o necesitas actualizar la información de tu empresa, 
              por favor contáctanos a <a href="mailto:gestionempresarial@upqroo.edu.mx" className="text-blue-600 hover:underline">gestionempresarial@upqroo.edu.mx</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}