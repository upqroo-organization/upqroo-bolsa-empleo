'use client';

import { useState, useEffect } from 'react';
import { Survey } from '@/types/survey';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Calendar, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EncuestasPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/coordinador/surveys');
      if (response.ok) {
        const data = await response.json();
        setSurveys(data);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSurvey = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta encuesta?')) {
      return;
    }

    try {
      const response = await fetch(`/api/coordinador/surveys/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSurveys(surveys.filter(s => s.id !== id));
        toast.success('Encuesta eliminada correctamente');
      } else {
        toast.error('Error al eliminar la encuesta');
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast.error('Error al eliminar la encuesta');
    }
  };

  const toggleSurveyStatus = async (id: string, isActive: boolean) => {
    setTogglingStatus(id);
    try {
      const response = await fetch(`/api/coordinador/surveys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        const updatedSurvey = await response.json();
        setSurveys(surveys.map(s => s.id === id ? updatedSurvey : s));
        
        const statusText = !isActive ? 'activada' : 'desactivada';
        toast.success(`Encuesta ${statusText} correctamente`);
      } else {
        toast.error('Error al cambiar el estado de la encuesta');
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      toast.error('Error al cambiar el estado de la encuesta');
    } finally {
      setTogglingStatus(null);
    }
  };

  const getSurveyStatus = (survey: Survey) => {
    return survey.isActive ? 'Activa' : 'Inactiva';
  };

  if (loading) {
    return <div className="p-6">Cargando encuestas...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Gestión de Encuestas</h1>
        <Link href="/coordinador/encuestas/nueva">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Encuesta
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <span className="text-base sm:text-lg leading-tight">{survey.title}</span>
                    <Badge 
                      variant={survey.isActive ? 'default' : 'secondary'} 
                      className={`w-fit ${survey.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                    >
                      {getSurveyStatus(survey)}
                    </Badge>
                  </CardTitle>
                  {survey.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                      {survey.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <Link href={`/coordinador/encuestas/${survey.id}`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/coordinador/encuestas/${survey.id}/editar`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSurveyStatus(survey.id, survey.isActive)}
                    disabled={togglingStatus === survey.id}
                    className="text-xs px-2 h-8"
                  >
                    {togglingStatus === survey.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        <span className="hidden sm:inline">Cambiando...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">{survey.isActive ? 'Desactivar' : 'Activar'}</span>
                        <span className="sm:hidden">{survey.isActive ? 'Des.' : 'Act.'}</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSurvey(survey.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 w-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Disponible {survey.daysAfterHiring} días después</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 w-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Duración: {survey.surveyDuration} días</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 w-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{survey.questions?.length || 0} preguntas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 w-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{survey._count?.responses || 0} respuestas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {surveys.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No hay encuestas creadas</p>
              <Link href="/coordinador/encuestas/nueva">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Encuesta
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}