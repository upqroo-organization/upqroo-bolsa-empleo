import { useState, useEffect } from 'react';
import { Event } from '@/types/events';

interface UseEventsOptions {
  limit?: number;
  page?: number;
  eventType?: string;
  stateId?: string;
  upcoming?: boolean;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => void;
}

export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseEventsReturn['pagination']>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.page) params.append('page', options.page.toString());
      if (options.eventType) params.append('eventType', options.eventType);
      if (options.stateId) params.append('stateId', options.stateId);
      if (options.upcoming) params.append('upcoming', 'true');

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Error al cargar eventos');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [options.limit, options.page, options.eventType, options.stateId, options.upcoming]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents
  };
}