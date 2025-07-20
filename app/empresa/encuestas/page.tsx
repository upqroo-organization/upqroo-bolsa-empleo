'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Survey } from '@/types/survey';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface CompanySurveyData {
  surveys: (Survey & {
    pendingCount: number;
    completedCount: number;
    totalStudents: number;
    pendingStudents: Array<{
      id: string;
      name?: string;
      email?: string;
    }>;
  })[];
  students: Array<{
    id: string;
    name?: string;
    email?: string;
  }>;
}

export default function EmpresaEncuestasPage() {
  const { data: session } = useSession();
  const [surveyData, setSurveyData] = useState<CompanySurveyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchSurveys();
    }
  }, [session]);

  const fetchSurveys = async () => {
    try {
      // Assuming we have company ID in session or need to get it
      const companyId = (session?.user as any)?.companyId || 'company-id'; // You'll need to adjust this
      
      const response = await fetch(`/api/empresa/surveys?companyId=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setSurveyData(data);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando encuestas...</div>;
  }

  if (!surveyData) {
    return <div className="p-6">Error al cargar las encuestas</div>;
  }

  const totalPendingSurveys = surveyData.surveys.reduce((sum, survey) => sum + survey.pendingCount, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Encuestas de Desempeño</h1>
        {totalPendingSurveys > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {totalPendingSurveys} encuestas pendientes
          </Badge>
        )}
      </div>

      <div className="grid gap-4">
        {surveyData.surveys.map((survey) => (
          <Card key={survey.id} className={survey.pendingCount > 0 ? 'border-orange-200 bg-orange-50' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {survey.title}
                    {survey.pendingCount > 0 ? (
                      <Badge variant="destructive">
                        {survey.pendingCount} pendientes
                      </Badge>
                    ) : (
                      <Badge variant="default">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completada
                      </Badge>
                    )}
                  </CardTitle>
                  {survey.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {survey.description}
                    </p>
                  )}
                </div>
                {survey.pendingCount > 0 && (
                  <Link href={`/empresa/encuestas/${survey.id}`}>
                    <Button>
                      Completar Encuestas
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(survey.startDate).toLocaleDateString()} - {new Date(survey.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {survey.questions?.length || 0} preguntas
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{survey.totalStudents}</div>
                  <div className="text-sm text-gray-600">Total Estudiantes</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{survey.completedCount}</div>
                  <div className="text-sm text-gray-600">Completadas</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">{survey.pendingCount}</div>
                  <div className="text-sm text-gray-600">Pendientes</div>
                </div>
              </div>

              {survey.pendingStudents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Estudiantes pendientes de evaluar:</p>
                  <div className="flex flex-wrap gap-2">
                    {survey.pendingStudents.map((student) => (
                      <Badge key={student.id} variant="outline">
                        {student.name || student.email}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {surveyData.surveys.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No hay encuestas disponibles en este momento</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}