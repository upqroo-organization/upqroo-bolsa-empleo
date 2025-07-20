'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CreateSurveyData, CreateSurveyQuestionData } from '@/types/survey';
import { SURVEY_LIMITS, SURVEY_VALIDATION_MESSAGES } from '@/constants/survey';

export default function NuevaEncuestaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    daysAfterHiring: 30,
    surveyDuration: 30
  });
  const [questions, setQuestions] = useState<CreateSurveyQuestionData[]>([
    { question: '', order: 1, isRequired: true }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', order: questions.length + 1, isRequired: true }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      // Reorder questions
      const reorderedQuestions = newQuestions.map((q, i) => ({
        ...q,
        order: i + 1
      }));
      setQuestions(reorderedQuestions);
    }
  };

  const updateQuestion = (index: number, field: keyof CreateSurveyQuestionData, value: unknown) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = SURVEY_VALIDATION_MESSAGES.TITLE_REQUIRED;
    } else if (formData.title.length > SURVEY_LIMITS.TITLE_MAX_LENGTH) {
      newErrors.title = SURVEY_VALIDATION_MESSAGES.TITLE_TOO_LONG;
    }

    // Validate description
    if (formData.description && formData.description.length > SURVEY_LIMITS.DESCRIPTION_MAX_LENGTH) {
      newErrors.description = SURVEY_VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG;
    }

    // Validate timing
    if (formData.daysAfterHiring < SURVEY_LIMITS.MIN_DAYS_AFTER_HIRING || formData.daysAfterHiring > SURVEY_LIMITS.MAX_DAYS_AFTER_HIRING) {
      newErrors.daysAfterHiring = SURVEY_VALIDATION_MESSAGES.DAYS_AFTER_HIRING_INVALID;
    }

    if (formData.surveyDuration < SURVEY_LIMITS.MIN_SURVEY_DURATION || formData.surveyDuration > SURVEY_LIMITS.MAX_SURVEY_DURATION) {
      newErrors.surveyDuration = SURVEY_VALIDATION_MESSAGES.SURVEY_DURATION_INVALID;
    }

    // Validate questions
    const validQuestions = questions.filter(q => q.question.trim() !== '');
    if (validQuestions.length < SURVEY_LIMITS.MIN_QUESTIONS) {
      newErrors.questions = SURVEY_VALIDATION_MESSAGES.MIN_QUESTIONS_REQUIRED;
    } else if (validQuestions.length > SURVEY_LIMITS.MAX_QUESTIONS) {
      newErrors.questions = SURVEY_VALIDATION_MESSAGES.MAX_QUESTIONS_EXCEEDED;
    }

    // Validate individual questions
    questions.forEach((question, index) => {
      if (question.question.trim() && question.question.length > SURVEY_LIMITS.QUESTION_MAX_LENGTH) {
        newErrors[`question_${index}`] = SURVEY_VALIDATION_MESSAGES.QUESTION_TOO_LONG;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const surveyData: CreateSurveyData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        daysAfterHiring: formData.daysAfterHiring,
        surveyDuration: formData.surveyDuration,
        questions: questions.filter(q => q.question.trim() !== '')
      };

      const response = await fetch('/api/coordinador/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      });

      if (response.ok) {
        router.push('/coordinador/encuestas');
      } else {
        const errorData = await response.json();
        alert(`Error al crear la encuesta: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Error al crear la encuesta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/coordinador/encuestas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nueva Encuesta</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={SURVEY_LIMITS.TITLE_MAX_LENGTH}
                required
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{errors.title && <span className="text-red-500">{errors.title}</span>}</span>
                <span>{formData.title.length}/{SURVEY_LIMITS.TITLE_MAX_LENGTH}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={SURVEY_LIMITS.DESCRIPTION_MAX_LENGTH}
                rows={3}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{errors.description && <span className="text-red-500">{errors.description}</span>}</span>
                <span>{formData.description.length}/{SURVEY_LIMITS.DESCRIPTION_MAX_LENGTH}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daysAfterHiring">Días después de contratación *</Label>
                <Input
                  id="daysAfterHiring"
                  type="number"
                  min={SURVEY_LIMITS.MIN_DAYS_AFTER_HIRING}
                  max={SURVEY_LIMITS.MAX_DAYS_AFTER_HIRING}
                  value={formData.daysAfterHiring}
                  onChange={(e) => setFormData({ ...formData, daysAfterHiring: parseInt(e.target.value) || 0 })}
                  required
                />
                <div className="text-xs mt-1">
                  {errors.daysAfterHiring ? (
                    <span className="text-red-500">{errors.daysAfterHiring}</span>
                  ) : (
                    <span className="text-gray-500">
                      La encuesta estará disponible después de este número de días desde que el estudiante fue contratado
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="surveyDuration">Duración de la encuesta (días) *</Label>
                <Input
                  id="surveyDuration"
                  type="number"
                  min={SURVEY_LIMITS.MIN_SURVEY_DURATION}
                  max={SURVEY_LIMITS.MAX_SURVEY_DURATION}
                  value={formData.surveyDuration}
                  onChange={(e) => setFormData({ ...formData, surveyDuration: parseInt(e.target.value) || 30 })}
                  required
                />
                <div className="text-xs mt-1">
                  {errors.surveyDuration ? (
                    <span className="text-red-500">{errors.surveyDuration}</span>
                  ) : (
                    <span className="text-gray-500">
                      Por cuántos días estará disponible la encuesta una vez que se active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Preguntas</CardTitle>
              <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Pregunta
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.questions && (
              <div className="text-red-500 text-sm">{errors.questions}</div>
            )}
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Label>Pregunta {index + 1}</Label>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  placeholder="Escribe tu pregunta aquí..."
                  maxLength={SURVEY_LIMITS.QUESTION_MAX_LENGTH}
                  required
                />
                <div className="flex justify-between text-xs mt-2">
                  <div>
                    {errors[`question_${index}`] ? (
                      <span className="text-red-500">{errors[`question_${index}`]}</span>
                    ) : (
                      <span className="text-gray-500">
                        Las respuestas serán calificadas del 0 al 5: Muy Bien (5), Bien (4), Regular (3), Mal (2), Pésimo (1), No aplica (0)
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    {question.question.length}/{SURVEY_LIMITS.QUESTION_MAX_LENGTH}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/coordinador/encuestas">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Encuesta'}
          </Button>
        </div>
      </form>
    </div>
  );
}