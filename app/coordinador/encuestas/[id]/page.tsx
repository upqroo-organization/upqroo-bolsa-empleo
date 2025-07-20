'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Survey, SurveyResponse, RATING_LABELS } from '@/types/survey';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function SurveyDetailsPage() {
  const params = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSurvey = useCallback(async () => {
    try {
      const response = await fetch(`/api/coordinador/surveys/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSurvey(data);
      }
    } catch (error) {
      console.error('Error fetching survey:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchSurvey();
    }
  }, [fetchSurvey, params.id]);


  const calculateQuestionStats = (questionId: string) => {
    if (!survey?.responses) return null;

    const answers = survey.responses
      .flatMap(r => r.answers)
      .filter(a => a.questionId === questionId);

    if (answers.length === 0) return null;

    const ratingCounts = answers.reduce((acc, answer) => {
      acc[answer.rating] = (acc[answer.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const total = answers.length;
    const average = answers.reduce((sum, a) => sum + a.rating, 0) / total;

    return {
      total,
      average: Math.round(average * 100) / 100,
      distribution: ratingCounts
    };
  };

  if (loading) {
    return <div className="p-6">Cargando encuesta...</div>;
  }

  if (!survey) {
    return <div className="p-6">Encuesta no encontrada</div>;
  }

  const getSurveyStatus = () => {
    return survey?.isActive ? 'Activa' : 'Inactiva';
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/coordinador/encuestas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{survey.title}</h1>
        <Badge variant={survey.isActive ? 'default' : 'secondary'}>
          {getSurveyStatus()}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Survey Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Encuesta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {survey.description && (
              <p className="text-gray-600">{survey.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Disponible {survey.daysAfterHiring} días después de contratación
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Duración: {survey.surveyDuration} días
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {survey.questions.length} preguntas
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                {survey.responses?.length || 0} respuestas
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions and Stats */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Preguntas y Estadísticas</h2>
          {survey.questions.map((question, index) => {
            const stats = calculateQuestionStats(question.id);
            return (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="font-medium">Respuestas:</span> {stats.total}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Promedio:</span> {stats.average}/5
                        </div>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(RATING_LABELS).reverse().map(([rating, label]) => {
                          const count = stats.distribution[parseInt(rating)] || 0;
                          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-2">
                              <div className="w-20 text-sm">{label}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <div className="w-12 text-sm text-right">
                                {count} ({Math.round(percentage)}%)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Sin respuestas aún</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Responses */}
        {survey.responses && survey.responses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Respuestas Recibidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {survey.responses.map((response) => (
                  <div key={response.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          {response.company?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Evaluando a: {response.student?.name || response.student?.email}
                        </p>
                      </div>
                      <Badge variant={response.isCompleted ? 'default' : 'secondary'}>
                        {response.isCompleted ? 'Completada' : 'Pendiente'}
                      </Badge>
                    </div>
                    {response.comments && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Comentarios:</p>
                        <p className="text-sm text-gray-600">{response.comments}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(response.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}