'use client';
import { Spinner } from "@/components/Spinner";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Suspense fallback={<Spinner/>}>
        {children}
      </Suspense>
    </SessionProvider>
  );
}
