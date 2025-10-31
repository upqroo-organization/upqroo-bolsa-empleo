import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";

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
        <Script id="prevent-tab-reload" strategy="beforeInteractive">
          {`
            // Prevent NextAuth session refetch on tab visibility changes
            if (typeof window !== 'undefined') {
              let originalFetch = window.fetch;
              window.fetch = function(...args) {
                const url = args[0];
                // Block session-related API calls when tab becomes visible
                if (typeof url === 'string' && url.includes('/api/auth/session') && document.hidden === false) {
                  const urlObj = new URL(url, window.location.origin);
                  if (urlObj.searchParams.has('update')) {
                    // Skip automatic session updates on tab focus
                    return Promise.resolve(new Response('{}', { status: 200 }));
                  }
                }
                return originalFetch.apply(this, args);
              };
            }
          `}
        </Script>
        <TooltipProvider>
          {children}
        </TooltipProvider>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
