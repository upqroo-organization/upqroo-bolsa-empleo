// Session configuration to prevent tab switching reloads
export const sessionConfig = {
  // Disable automatic session polling when tab is not visible
  refetchOnWindowFocus: false as const,
  // Disable automatic session refetch when tab becomes visible
  refetchWhenOffline: false as const,
  // Increase session polling interval to reduce unnecessary checks
  refetchInterval: 0, // Disable automatic refetch
  // Keep session data cached longer
  staleTime: 5 * 60 * 1000, // 5 minutes
} as const