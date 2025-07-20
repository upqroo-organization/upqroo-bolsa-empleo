'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Survey, RATING_LABELS, RatingValue } from '@/types/survey';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { SURVEY_LIMITS } from '@/constants/survey';

interface StudentSurveyData {
  survey: Survey;
  students: Array<{
    id: string;
    name?: string;
    email?: string;
  }>;
  existingResponses: Array<{
    studentId: string;
    isCompleted: boolean;
  }>;
}

export default function CompletarEncuestaPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [surveyData, setSurveyData] = useState<StudentSurveyData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSurveyData = useCallback(async () => {
    try {
      console.log(session?.user)
      const companyId = (session?.user as any)?.id || 'company-id'; // Adjust this
      
      const [surveyResponse, responsesResponse] = await Promise.all([
        fetch(`/api/empresa/surveys?companyId=${companyId}`),
        fetch(`/api/empresa/surveys/${params.id}/responses?companyId=${companyId}`)
      ]);

      if (surveyResponse.ok && responsesResponse.ok) {
        const surveyData = await surveyResponse.json();
        const existingResponses = await responsesResponse.json();
        
        const currentSurvey = surveyData.surveys.find((s: any) => s.id === params.id);
        
        if (currentSurvey) {
          setSurveyData({
            survey: currentSurvey,
            students: surveyData.students,
            existingResponses: existingResponses.map((r: any) => ({
              studentId: r.studentId,
              isCompleted: r.isCompleted
            }))
          });
        }
      }
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id, session?.user]);
  
  useEffect(() => {
    if (params.id && session?.user) {
      fetchSurveyData();
    }
  }, [fetchSurveyData, params.id, session]);


  const handleAnswerChange = (questionId: string, rating: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !surveyData) return;

    setSubmitting(true);

    try {
      const companyId = (session?.user as unknown)?.id || 'company-id'; // Adjust this
      
      const response = await fetch(`/api/empresa/surveys/${params.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          studentId: selectedStudent,
          answers,
          comments: comments.trim() || undefined
        })
      });

      if (response.ok) {
        router.push('/empresa/encuestas');
      } else {
        alert('Error al enviar la encuesta');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error al enviar la encuesta');
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableStudents = () => {
    if (!surveyData) return [];
    
    const completedStudentIds = surveyData.existingResponses
      .filter(r => r.isCompleted)
      .map(r => r.studentId);
    
    return surveyData.students.filter(
      student => !completedStudentIds.includes(student.id)
    );
  };

  const isFormValid = () => {
    if (!selectedStudent || !surveyData) return false;
    
    const requiredQuestions = surveyData.survey.questions.filter(q => q.isRequired);
    return requiredQuestions.every(q => answers[q.id] !== undefined);
  };

  if (loading) {
    return <div className="p-6">Cargando encuesta...</div>;
  }

  if (!surveyData) {
    return <div className="p-6">Encuesta no encontrada</div>;
  }

  const availableStudents = getAvailableStudents();

  if (availableStudents.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/empresa/encuestas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Encuesta Completada</h1>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              Ya has completado la evaluación para todos los estudiantes disponibles.
            </p>
            <Link href="/empresa/encuestas">
              <Button className="mt-4">Volver a Encuestas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/empresa/encuestas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{surveyData.survey.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Seleccionar Estudiante a Evaluar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedStudent} onValueChange={setSelectedStudent}>
              {availableStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={student.id} id={student.id} />
                  <Label htmlFor={student.id} className="cursor-pointer">
                    {student.name || student.email}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Questions */}
        {selectedStudent && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Evaluación de Desempeño</h2>
            {surveyData.survey.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question.question}
                    {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[question.id]?.toString() || ''}
                    onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                  >
                    {Object.entries(RATING_LABELS).reverse().map(([rating, label]) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem value={rating} id={`${question.id}-${rating}`} />
                        <Label htmlFor={`${question.id}-${rating}`} className="cursor-pointer">
                          {label} ({rating})
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comentarios Adicionales (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Comparte cualquier comentario adicional sobre el desempeño del estudiante..."
                  maxLength={SURVEY_LIMITS.COMMENTS_MAX_LENGTH}
                  rows={4}
                />
                <div className="flex justify-end text-xs text-gray-500 mt-1">
                  <span>{comments.length}/{SURVEY_LIMITS.COMMENTS_MAX_LENGTH}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/empresa/encuestas">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={!isFormValid() || submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar Evaluación'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}