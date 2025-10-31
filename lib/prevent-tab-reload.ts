/**
 * Utility to prevent unnecessary page reloads when switching browser tabs
 * This addresses the common issue where NextAuth sessions cause reloads on tab visibility changes
 */

// Prevent NextAuth from automatically refetching session on window focus
if (typeof window !== 'undefined') {
  // Override the default behavior of NextAuth session refetch on window focus
  const originalAddEventListener = window.addEventListener;

  window.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    // Skip adding focus/blur event listeners that might cause session refetch
    if (type === 'focus' || type === 'blur' || type === 'visibilitychange') {
      // Only add the listener if it's not related to session management
      if (typeof listener === 'function') {
        const listenerString = listener.toString();
        if (listenerString.includes('session') || listenerString.includes('refetch')) {
          return;
        }
      }
    }

    return originalAddEventListener.call(this, type, listener, options);
  };
}

export const preventTabReload = {
  // Configuration for NextAuth SessionProvider
  sessionProviderConfig: {
    refetchOnWindowFocus: false,
    refetchWhenOffline: false,
    refetchInterval: 0,
  },

  // Initialize prevention measures
  init: () => {
    if (typeof window === 'undefined') return;

    // Prevent automatic session refresh on visibility change
    let isVisible = !document.hidden;

    const handleVisibilityChange = () => {
      const wasVisible = isVisible;
      isVisible = !document.hidden;

      // Don't trigger any session-related actions on visibility change
      if (wasVisible !== isVisible) {
        // Optionally log for debugging
        // console.log('Tab visibility changed, but preventing session refetch');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }
};