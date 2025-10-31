'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode, memo } from "react";
import { sessionConfig } from "@/lib/session-config";

interface StableSessionProviderProps {
  children: ReactNode;
}

/**
 * A stable SessionProvider that prevents unnecessary re-renders
 * when browser tab visibility changes
 */
const StableSessionProvider = memo(function StableSessionProvider({
  children
}: StableSessionProviderProps) {
  return (
    <SessionProvider
      refetchOnWindowFocus={sessionConfig.refetchOnWindowFocus}
      refetchWhenOffline={sessionConfig.refetchWhenOffline}
      refetchInterval={sessionConfig.refetchInterval}
    >
      {children}
    </SessionProvider>
  );
});

export default StableSessionProvider;