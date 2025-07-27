'use client';

import { AlertCircle, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { usePendingSurveys } from '@/hooks/usePendingSurveys';

export function NewSurveyIndicator() {
  const { totalPendingSurveys, surveysWithPending } = usePendingSurveys();

  if (totalPendingSurveys === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800 mb-1">
              ¡Tienes encuestas pendientes!
            </h3>
            <p className="text-sm text-orange-700">
              Hay {totalPendingSurveys} evaluación{totalPendingSurveys !== 1 ? 'es' : ''} de desempeño esperando tu respuesta.
            </p>
            {surveysWithPending.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {surveysWithPending.map((survey) => (
                  <Badge key={survey.id} variant="secondary" className="text-xs">
                    {survey.title}: {survey.pendingCount} pendiente{survey.pendingCount !== 1 ? 's' : ''}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}