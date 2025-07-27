import { useEffect, useState, useCallback } from 'react';
import { User, UserResponse, UserErrorResponse, UpdateUserData } from '@/types/users';

type UseCurrentUserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  updating: boolean;
};

export function useCurrentUser() {
  const [state, setState] = useState<UseCurrentUserState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    updating: false,
  });

  const fetchUser = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/usuarios/me');
      const data: UserResponse | UserErrorResponse = await response.json();

      if (!response.ok) {
        const errorData = data as UserErrorResponse;
        setState(prev => ({
          ...prev,
          user: null,
          loading: false,
          error: errorData.error,
          isAuthenticated: false,
        }));
        return;
      }

      const successData = data as UserResponse;
      setState(prev => ({
        ...prev,
        user: successData.data,
        loading: false,
        error: null,
        isAuthenticated: true,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: 'Error de conexión',
        isAuthenticated: false,
      }));
      console.debug(error);
    }
  }, []);

  const updateUser = useCallback(async (userData: UpdateUserData) => {
    setState(prev => ({ ...prev, updating: true, error: null }));

    try {
      const response = await fetch('/api/usuarios/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: UserResponse | UserErrorResponse = await response.json();

      if (!response.ok) {
        const errorData = data as UserErrorResponse;
        setState(prev => ({
          ...prev,
          updating: false,
          error: errorData.error,
        }));
        return { success: false, error: errorData.error };
      }

      const successData = data as UserResponse;
      setState(prev => ({
        ...prev,
        user: successData.data,
        updating: false,
        error: null,
      }));

      return { success: true, message: successData.message };
    } catch (error) {
      setState(prev => ({
        ...prev,
        updating: false,
        error: 'Error de conexión',
      }));
      console.debug(error)
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  const refetch = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    ...state,
    refetch,
    updateUser,
  };
}