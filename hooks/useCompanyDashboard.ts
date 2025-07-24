import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  cvUrl: string | null;
}

interface Vacante {
  id: string;
  title: string;
}

interface Application {
  id: string;
  user: User;
  vacante: Vacante;
  status: string;
  appliedAt: string;
}

interface JobApplication {
  id: string;
  status: string;
  appliedAt: string;
}

interface ActiveJob {
  id: string;
  title: string;
  applicationsCount: number;
  views: number;
  createdAt: string;
  deadline: string | null;
  status: string;
  applications: JobApplication[];
}

interface Company {
  id: string;
  name: string;
  email: string;
  description: string | null;
  logoUrl: string | null;
  city: string | null;
  phone: string | null;
  websiteUrl: string | null;
  industry: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  state: {
    id: number;
    name: string;
  } | null;
  profileCompletion: number;
}

interface Stats {
  activeVacancies: {
    count: number;
    change: number;
  };
  totalApplications: {
    count: number;
    change: number;
  };
  totalViews: {
    count: number;
    growth: number;
  };
}

interface DashboardData {
  company: Company;
  stats: Stats;
  recentApplications: Application[];
  activeJobs: ActiveJob[];
}

export function useCompanyDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/empresa/dashboard');
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos del dashboard');
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
}