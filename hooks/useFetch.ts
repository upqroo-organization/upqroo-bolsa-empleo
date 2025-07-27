/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";

type FetchState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  isFirstRender: boolean;
};

export function useFetch<T = any>(
  initialUrl: string,
  initialOptions?: RequestInit
) {
  const [url, setUrl] = useState(initialUrl);
  const [options, setOptions] = useState<RequestInit | undefined>(initialOptions);

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
    isFirstRender: true,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstRenderRef = useRef(true);

  const fetchData = useCallback(
    async (apiUrl: string, apiOptions?: RequestInit) => {
      // Abort any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        isFirstRender: isFirstRenderRef.current,
      }));

      try {
        const response = await fetch(apiUrl, { ...apiOptions, signal });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        setState((prev) => ({
          ...prev,
          data: json,
          loading: false,
          error: null,
          isFirstRender: isFirstRenderRef.current,
        }));
      } catch (err: any) {
        if (err.name === "AbortError") {
          // ignore abort errors
          return;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err,
          isFirstRender: isFirstRenderRef.current,
        }));
      } finally {
        isFirstRenderRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    fetchData(url, options);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, options, fetchData]);

  const refetch = (newUrl?: string, newOptions?: RequestInit) => {
    if (newUrl) setUrl(newUrl);
    if (newOptions) setOptions(newOptions);
    else fetchData(newUrl ?? url, newOptions ?? options);
  };

  return {
    ...state,
    refetch,
  };
}
