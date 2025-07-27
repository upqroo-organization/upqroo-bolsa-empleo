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

  const deleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/empresa/vacantes/${jobId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchJobs(); // Refresh the jobs list
        return true;
      } else {
        toast.error(data.error || 'Error al eliminar vacante');
        return false;
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error al eliminar vacante');
      return false;
    }
  };

  const duplicateJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/empresa/vacantes/${jobId}`);
      const data = await response.json();
      
      if (data.success) {
        const job = data.data;
        // Create a copy with modified title
        const duplicatedJob = {
          ...job,
          title: `${job.title} (Copia)`,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        };
        
        const createResponse = await fetch('/api/empresa/vacantes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(duplicatedJob),
        });

        const createData = await createResponse.json();
        
        if (createData.success) {
          toast.success('Vacante duplicada correctamente');
          fetchJobs(); // Refresh the jobs list
          return true;
        } else {
          toast.error('Error al duplicar vacante');
          return false;
        }
      } else {
        toast.error('Error al obtener datos de la vacante');
        return false;
      }
    } catch (error) {
      console.error('Error duplicating job:', error);
      toast.error('Error al duplicar vacante');
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
    deleteJob,
    duplicateJob,
  };
}