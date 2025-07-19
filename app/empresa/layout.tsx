'use client'
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main>
    <SessionProvider>
      <ConditionalNavbar />
      {children}
      <Toaster richColors />
    </SessionProvider>
   </main>        
  );
}
