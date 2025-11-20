import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";
import { generateMetadata } from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { seoConfig } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateMetadata({
  title: "Red Talento UPQROO - Bolsa de Trabajo Universitaria",
  description: "Plataforma oficial de empleos de la Universidad Politécnica de Quintana Roo. Conectamos estudiantes y egresados con las mejores oportunidades laborales en Quintana Roo y México.",
  canonical: seoConfig.siteUrl
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <head>
        {/* Datos estructurados para la organización */}
        <StructuredData type="organization" />
        <StructuredData type="website" />
        
        {/* Preconnect para mejorar rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch para dominios externos */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Favicon y iconos */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags adicionales para SEO */}
        <meta name="author" content="Universidad Politécnica de Quintana Roo" />
        <meta name="publisher" content="UPQROO" />
        <meta name="copyright" content="Universidad Politécnica de Quintana Roo" />
        <meta name="language" content="Spanish" />
        <meta name="geo.region" content="MX-ROO" />
        <meta name="geo.placename" content="Quintana Roo, México" />
        <meta name="geo.position" content="21.161908;-86.851528" />
        <meta name="ICBM" content="21.161908, -86.851528" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics 4 Optimizado */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                custom_parameter_1: 'user_type',
                custom_parameter_2: 'job_category'
              },
              send_page_view: true,
              anonymize_ip: true,
              allow_google_signals: true,
              allow_ad_personalization_signals: false
            });
          `}
        </Script>

        {/* Google Tag Manager (opcional para conversiones avanzadas) */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID || ''}');
          `}
        </Script>

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
