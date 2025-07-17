'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Edit, Save, Loader2, FileText, Trash2, Download, AlertCircle } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StudentProfile() {
  const { user, loading, error, isAuthenticated, updating, updateUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
  });
  
  // CV upload state
  const [cvUploading, setCvUploading] = useState(false);
  const [cvDeleting, setCvDeleting] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.username.trim()) {
      alert('Nombre y nombre de usuario son requeridos');
      return;
    }

    const result = await updateUser({
      name: formData.name.trim(),
      username: formData.username.trim(),
    });

    if (result.success) {
      alert(result.message || 'Perfil actualizado correctamente');
      setIsEditing(false);
    } else {
      alert(result.error || 'Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
      });
    }
    setIsEditing(false);
  };

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
        alert(result.message || 'CV subido correctamente');
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
        alert(result.message || 'CV eliminado correctamente');
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

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'No autorizado'}</p>
              <Button onClick={() => window.location.reload()}>
                Intentar de nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600">No se pudo cargar la información del usuario</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={updating}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Académico</TabsTrigger>
          <TabsTrigger value="experience">Experiencia</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos básicos de tu perfil profesional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="text-lg">
                    {user.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" disabled={!isEditing}>
                    <Upload className="mr-2 h-4 w-4" />
                    Cambiar Foto
                  </Button>
                  <p className="text-sm text-gray-600">Formatos: JPG, PNG. Tamaño máximo: 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Ingresa tu nombre de usuario"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">El correo no se puede modificar</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input
                    id="role"
                    value={user.role?.name || 'Sin rol asignado'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Información de Cuenta</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Fecha de registro:</span>{' '}
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div>
                    <span className="font-medium">Última actualización:</span>{' '}
                    {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information - Placeholder for now */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Académica</CardTitle>
              <CardDescription>Detalles de tu formación universitaria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Esta sección estará disponible próximamente.</p>
                <p className="text-sm">Aquí podrás gestionar tu información académica.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience - Placeholder for now */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experiencia Laboral</CardTitle>
              <CardDescription>Historial de empleos, prácticas y proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Esta sección estará disponible próximamente.</p>
                <p className="text-sm">Aquí podrás gestionar tu experiencia laboral.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills - Placeholder for now */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Técnicas</CardTitle>
              <CardDescription>Tecnologías, herramientas y competencias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Esta sección estará disponible próximamente.</p>
                <p className="text-sm">Aquí podrás gestionar tus habilidades técnicas.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos y Portafolio</CardTitle>
              <CardDescription>CV, certificaciones y enlaces a proyectos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CV Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Currículum Vitae (CV)</h3>
                    <p className="text-sm text-gray-600">
                      Sube tu CV en formato PDF. Solo se permite un archivo por usuario.
                    </p>
                  </div>
                </div>

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

                {/* Upload button - always visible */}
                <div className="flex flex-col items-center gap-2">
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
                    className="w-full sm:w-auto"
                  >
                    {cvUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Subiendo CV...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {user.cvUrl ? 'Reemplazar CV' : 'Subir CV'}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Solo archivos PDF • Máximo 5MB
                  </p>
                </div>
              </div>

              {/* Future sections placeholder */}
              <div className="border-t pt-6">
                <div className="text-center py-8 text-gray-500">
                  <p className="font-medium">Próximamente</p>
                  <p className="text-sm">Certificaciones, portafolio y enlaces a proyectos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}