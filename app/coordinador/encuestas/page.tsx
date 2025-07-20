'use client';

import { useState, useEffect } from 'react';
import { Survey } from '@/types/survey';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function EncuestasPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  };

  const toggleSurveyStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/coordinador/surveys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        const updatedSurvey = await response.json();
        setSurveys(surveys.map(s => s.id === id ? updatedSurvey : s));
      }
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  };

  const isActive = (survey: Survey) => {
    const now = new Date();
    return survey.isActive && 
           new Date(survey.startDate) <= now && 
           new Date(survey.endDate) >= now;
  };

  if (loading) {
    return <div className="p-6">Cargando encuestas...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Encuestas</h1>
        <Link href="/coordinador/encuestas/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Encuesta
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {survey.title}
                    <Badge variant={isActive(survey) ? 'default' : 'secondary'}>
                      {isActive(survey) ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </CardTitle>
                  {survey.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {survey.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/coordinador/encuestas/${survey.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/coordinador/encuestas/${survey.id}/editar`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSurveyStatus(survey.id, survey.isActive)}
                  >
                    {survey.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSurvey(survey.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(survey.startDate).toLocaleDateString()} - {new Date(survey.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {survey.questions?.length || 0} preguntas
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {(survey as any)._count?.responses || 0} respuestas
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