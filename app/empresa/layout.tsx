'use client'
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { SessionProvider } from "next-auth/react";

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
    </SessionProvider>
   </main>        
  );
}
