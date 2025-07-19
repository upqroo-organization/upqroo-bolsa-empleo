'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface JobApplication {
  id: string;
  status: string;
  appliedAt: string;
  cvViewed: boolean;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    cvUrl: string | null;
  };
}

export interface Job {
  id: string;
  title: string;
  department: string | null;
  type: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  status: string;
  applicationsCount: number;
  createdAt: string;
  deadline: string | null;
  applications: JobApplication[];
}

export function useCompanyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/empresa/vacantes');
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      } else {
        toast.error('Error al cargar vacantes');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Error al cargar vacantes');
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, action: 'pause' | 'activate') => {
    try {
      const response = await fetch(`/api/empresa/vacantes/${jobId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchJobs(); // Refresh the jobs list
        return true;
      } else {
        toast.error('Error al actualizar estado');
        return false;
      }
    } catch (error) {
      console.error('Error toggling job status:', error);
      toast.error('Error al actualizar estado');
      return false;
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    fetchJobs,
    toggleJobStatus,
  };
}