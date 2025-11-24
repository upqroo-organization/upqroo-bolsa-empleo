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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://redtalento.upqroo.edu.mx"),
  title: {
    default: "Upqroo - Atracción Talento - Bolsa de empleo",
    template: "%s | Upqroo Bolsa de Empleo",
  },
  description: "Plataforma oficial de vinculación laboral de la Universidad Politécnica de Quintana Roo. Conectamos estudiantes y egresados con las mejores oportunidades laborales.",
  keywords: ["Bolsa de trabajo", "UPQROO", "Empleo", "Quintana Roo", "Universitarios", "Prácticas profesionales", "Vacantes"],
  authors: [{ name: "Universidad Politécnica de Quintana Roo", url: "https://upqroo.edu.mx" }],
  creator: "UPQROO",
  publisher: "UPQROO",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://redtalento.upqroo.edu.mx",
    title: "Upqroo - Atracción Talento - Bolsa de empleo",
    description: "Plataforma oficial de vinculación laboral de la Universidad Politécnica de Quintana Roo.",
    siteName: "UPQROO Bolsa de Empleo",
    images: [
      {
        url: "/og-image.jpg", // We might need to ensure this image exists or use a default
        width: 1200,
        height: 630,
        alt: "UPQROO Bolsa de Empleo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upqroo - Atracción Talento - Bolsa de empleo",
    description: "Plataforma oficial de vinculación laboral de la Universidad Politécnica de Quintana Roo.",
    images: ["/og-image.jpg"],
    creator: "@UPQROO", // Assuming handle, can be updated later
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
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
