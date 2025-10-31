'use client';
import Navbar from "@/components/Navbar";
import { Spinner } from "@/components/Spinner";
import { SessionProvider } from "next-auth/react";
import { sessionConfig } from "@/lib/session-config";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider
      refetchOnWindowFocus={sessionConfig.refetchOnWindowFocus}
      refetchWhenOffline={sessionConfig.refetchWhenOffline}
      refetchInterval={sessionConfig.refetchInterval}
    >
      <Navbar />
      <Suspense fallback={<Spinner />}>
        {children}
      </Suspense>
    </SessionProvider>
  );
}
