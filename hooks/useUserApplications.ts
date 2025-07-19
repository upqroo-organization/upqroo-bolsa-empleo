import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface ApplicationData {
  id: string
  userId: string
  vacanteId: string
  status: string
  appliedAt: string
}

interface UseUserApplicationsState {
  appliedJobs: Set<string>
  isLoading: boolean
  error: string | null
}

export function useUserApplications() {
  const { data: session } = useSession()
  const [state, setState] = useState<UseUserApplicationsState>({
    appliedJobs: new Set(),
    isLoading: false,
    error: null
  })

  const fetchUserApplications = useCallback(async () => {
    if (!session?.user?.id) {
      setState(prev => ({ ...prev, appliedJobs: new Set(), isLoading: false }))
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

      const appliedJobIds = new Set<string>(
        data.data.map((application: ApplicationData) => application.vacanteId)
      )

      setState(prev => ({
        ...prev,
        appliedJobs: appliedJobIds,
        isLoading: false,
        error: null
      }))
    } catch (error) {
      console.error(error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error de conexión'
      }))
    }
  }, [session?.user?.id])

  const hasAppliedToJob = useCallback((jobId: string) => {
    return state.appliedJobs.has(jobId)
  }, [state.appliedJobs])

  const addAppliedJob = useCallback((jobId: string) => {
    setState(prev => ({
      ...prev,
      appliedJobs: new Set([...prev.appliedJobs, jobId])
    }))
  }, [])

  useEffect(() => {
    fetchUserApplications()
  }, [fetchUserApplications])

  return {
    ...state,
    hasAppliedToJob,
    addAppliedJob,
    refetch: fetchUserApplications
  }
}