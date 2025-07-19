import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface ApplicationWithVacante {
  id: string
  userId: string
  vacanteId: string
  status: string
  appliedAt: string
  vacante: {
    id: string
    title: string
    summary: string
    description: string
    location: string | null
    salaryMin: number | null
    salaryMax: number | null
    type: string | null
    modality: string | null
    career: string | null
    deadline: string | null
    company: {
      name: string
      logoUrl: string | null
    }
    state: {
      id: number
      name: string
    } | null
  }
}

interface UseMyApplicationsState {
  applications: ApplicationWithVacante[]
  isLoading: boolean
  error: string | null
}

export function useMyApplications() {
  const { data: session } = useSession()
  const [state, setState] = useState<UseMyApplicationsState>({
    applications: [],
    isLoading: false,
    error: null
  })

  const fetchApplications = useCallback(async () => {
    if (!session?.user?.id) {
      setState(prev => ({ ...prev, applications: [], isLoading: false }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/applications')
      const data = await response.json()

      if (!response.ok) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || 'Error fetching applications'
        }))
        return
      }

      setState(prev => ({
        ...prev,
        applications: data.data || [],
        isLoading: false,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error de conexión'
      }))
    }
  }, [session?.user?.id])

  const getStatusCount = useCallback((status: string) => {
    return state.applications.filter(app => app.status === status).length
  }, [state.applications])

  const getActiveCount = useCallback(() => {
    return state.applications.filter(app => !['rejected'].includes(app.status)).length
  }, [state.applications])

  const getApplicationsByStatus = useCallback((status?: string) => {
    if (!status) return state.applications
    return state.applications.filter(app => app.status === status)
  }, [state.applications])

  const getActiveApplications = useCallback(() => {
    return state.applications.filter(app => !['rejected'].includes(app.status))
  }, [state.applications])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    ...state,
    getStatusCount,
    getActiveCount,
    getApplicationsByStatus,
    getActiveApplications,
    refetch: fetchApplications
  }
}