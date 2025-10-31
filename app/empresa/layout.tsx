'use client'
import ConditionalNavbar from "@/components/ConditionalNavbar";
import SurveyNotification from "@/components/SurveyNotification";
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
        <ConditionalNavbar />
        {children}
        <SurveyNotification />
      </SessionProvider>
    </main>
  );
}
