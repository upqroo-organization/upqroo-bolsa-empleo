import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface PendingSurveyData {
  totalPendingSurveys: number;
  surveysWithPending: Array<{
    id: string;
    title: string;
    pendingCount: number;
  }>;
}

export function usePendingSurveys() {
  const { data: session } = useSession();
  const [pendingData, setPendingData] = useState<PendingSurveyData>({
    totalPendingSurveys: 0,
    surveysWithPending: []
  });
  const [loading, setLoading] = useState(false);
  const previousCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  const fetchPendingSurveys = async () => {
    console.log('usePendingSurvey', session?.user)
    if (!session?.user?.id || session?.user?.role !== 'company') {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/empresa/surveys/notifications?companyId=${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Error fetching survey notifications');
      }

      const data = await response.json();
      const newTotalPending = data.totalPendingSurveys || 0;
      
      // Show toast notification if there are new pending surveys (but not on initial load)
      if (!isInitialLoadRef.current && newTotalPending > previousCountRef.current) {
        const newSurveys = newTotalPending - previousCountRef.current;
        toast.info(`Nueva${newSurveys > 1 ? 's' : ''} encuesta${newSurveys > 1 ? 's' : ''} disponible${newSurveys > 1 ? 's' : ''}`, {
          description: `Tienes ${newSurveys} nueva${newSurveys > 1 ? 's' : ''} evaluación${newSurveys > 1 ? 'es' : ''} de desempeño pendiente${newSurveys > 1 ? 's' : ''}`,
          duration: 6000,
          action: {
            label: 'Ver encuestas',
            onClick: () => window.location.href = '/empresa/encuestas'
          }
        });
      }
      
      previousCountRef.current = newTotalPending;
      isInitialLoadRef.current = false;
      
      setPendingData({
        totalPendingSurveys: newTotalPending,
        surveysWithPending: data.surveysWithPending || []
      });
    } catch (error) {
      console.error('Error fetching pending surveys:', error);
      setPendingData({
        totalPendingSurveys: 0,
        surveysWithPending: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSurveys();
    
    // Set up polling to check for new surveys every 5 minutes
    const interval = setInterval(fetchPendingSurveys, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [session?.user?.id, session?.user?.role]);

  return {
    ...pendingData,
    loading,
    refetch: fetchPendingSurveys
  };
}