'use client'
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { sessionConfig } from "@/lib/session-config";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SessionProvider
        refetchOnWindowFocus={sessionConfig.refetchOnWindowFocus}
        refetchWhenOffline={sessionConfig.refetchWhenOffline}
        refetchInterval={sessionConfig.refetchInterval}
      >
        <Navbar></Navbar>
        {children}
      </SessionProvider>
    </main>
  );
}