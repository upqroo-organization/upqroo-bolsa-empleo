import { useEffect, useRef } from 'react';

/**
 * Hook to handle page visibility changes without causing unnecessary re-renders
 * This helps prevent the app from reloading when switching browser tabs
 */
export function useVisibilityChange() {
  const wasVisible = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;

      // Only log visibility changes, don't trigger any state updates
      if (wasVisible.current !== isVisible) {
        wasVisible.current = isVisible;
        // Optionally log for debugging
        // console.log('Page visibility changed:', isVisible ? 'visible' : 'hidden');
      }
    };

    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return wasVisible.current;
}