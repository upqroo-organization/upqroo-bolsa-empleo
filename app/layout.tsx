import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Upqroo - Atracción Talento - Bolsa de empleo",
  description: "Atracció de talento y Bolsa de empleo creado por la Universidad Politécnica de Quintana Roo. Bolsa de trabajo enfocado en la comunidad universitaria de la Universidad Politécnica de Quintana Roo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
            {children}
        </TooltipProvider>
      
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
