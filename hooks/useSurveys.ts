import { useState, useEffect } from 'react';
import { Survey } from '@/types/survey';

interface UseSurveysOptions {
  companyId?: string;
  role?: 'coordinator' | 'company';
}

export function useSurveys({ companyId, role = 'coordinator' }: UseSurveysOptions = {}) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '';
      if (role === 'coordinator') {
        url = '/api/coordinador/surveys';
      } else if (role === 'company' && companyId) {
        url = `/api/empresa/surveys?companyId=${companyId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching surveys');
      }

      const data = await response.json();
      setSurveys(role === 'company' ? data.surveys : data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createSurvey = async (surveyData: unknown) => {
    try {
      const response = await fetch('/api/coordinador/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      });

      if (!response.ok) {
        throw new Error('Error creating survey');
      }

      const newSurvey = await response.json();
      setSurveys(prev => [newSurvey, ...prev]);
      return newSurvey;
    } catch (err) {
      throw err;
    }
  };

  const updateSurvey = async (id: string, updateData: unknown) => {
    try {
      const response = await fetch(`/api/coordinador/surveys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Error updating survey');
      }

      const updatedSurvey = await response.json();
      setSurveys(prev => prev.map(s => s.id === id ? updatedSurvey : s));
      return updatedSurvey;
    } catch (err) {
      throw err;
    }
  };

  const deleteSurvey = async (id: string) => {
    try {
      const response = await fetch(`/api/coordinador/surveys/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error deleting survey');
      }

      setSurveys(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const submitSurveyResponse = async (surveyId: string, responseData: unknown) => {
    try {
      const response = await fetch(`/api/empresa/surveys/${surveyId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });

      if (!response.ok) {
        throw new Error('Error submitting survey response');
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [companyId, role]);

  return {
    surveys,
    loading,
    error,
    refetch: fetchSurveys,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    submitSurveyResponse
  };
}