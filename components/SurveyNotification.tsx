'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

interface PendingSurvey {
  id: string;
  title: string;
  pendingCount: number;
}

export default function SurveyNotification() {
  const { data: session } = useSession();
  const [pendingSurveys, setPendingSurveys] = useState<PendingSurvey[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user && (session.user as unknown).role === 'company') {
      fetchPendingSurveys();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchPendingSurveys = async () => {
    try {
      const companyId = (session?.user as unknown)?.companyId || 'company-id'; // Adjust this
      
      const response = await fetch(`/api/empresa/surveys?companyId=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        const pending = data.surveys
          .filter((survey: unknown) => survey.pendingCount > 0)
          .map((survey: unknown) => ({
            id: survey.id,
            title: survey.title,
            pendingCount: survey.pendingCount
          }));
        
        setPendingSurveys(pending);
        setIsVisible(pending.length > 0);
      }
    } catch (error) {
      console.error('Error fetching pending surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isVisible || pendingSurveys.length === 0) {
    return null;
  }

  const totalPending = pendingSurveys.reduce((sum, survey) => sum + survey.pendingCount, 0);

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Encuestas Pendientes</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-orange-700 mb-3">
          Tienes {totalPending} evaluaciones pendientes de completar.
        </p>
        
        <div className="space-y-2 mb-3">
          {pendingSurveys.slice(0, 2).map((survey) => (
            <div key={survey.id} className="flex justify-between items-center text-sm">
              <span className="truncate">{survey.title}</span>
              <Badge variant="destructive" className="ml-2">
                {survey.pendingCount}
              </Badge>
            </div>
          ))}
          {pendingSurveys.length > 2 && (
            <p className="text-xs text-orange-600">
              +{pendingSurveys.length - 2} más...
            </p>
          )}
        </div>
        
        <Link href="/empresa/encuestas">
          <Button size="sm" className="w-full">
            Ver Encuestas
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}