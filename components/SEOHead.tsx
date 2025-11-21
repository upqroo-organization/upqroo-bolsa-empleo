import { Metadata } from 'next'
import { seoConfig } from '@/lib/seo'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: object
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  noIndex = false
}: SEOHeadProps): Metadata {
  const fullTitle = title 
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.siteName

  const metaDescription = description || seoConfig.description
  const allKeywords = [...seoConfig.keywords, ...keywords].join(', ')
  const canonicalUrl = canonical || seoConfig.siteUrl
  const imageUrl = ogImage || `${seoConfig.siteUrl}/og-image.jpg`

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: allKeywords,
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl
    },
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: seoConfig.openGraph.siteName,
      locale: seoConfig.openGraph.locale,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        }
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: '@upqroo_oficial',
      site: '@upqroo_oficial',
    },
    
    // Additional meta tags
    other: {
      'application-name': seoConfig.siteName,
      'apple-mobile-web-app-title': seoConfig.siteName,
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
    },
    
    // Verification tags (agregar cuando tengas las cuentas)
    verification: {
      google: 'google-site-verification-code', // Reemplazar con código real
      // yandex: 'yandex-verification-code',
      // bing: 'bing-verification-code',
    },
  }
}