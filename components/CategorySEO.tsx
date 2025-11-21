import { Metadata } from 'next'
import { generateMetadata } from './SEOHead'
import { generateCategoryKeywords, generateOptimizedDescription, generateSEOTitle } from '@/lib/seo-utils'

interface CategorySEOProps {
  category: string
  location?: string
  jobCount?: number
  jobs?: Array<{
    id: string
    title: string
    company: { name: string }
    location?: string
  }>
}

export function generateCategoryMetadata({
  category,
  location,
  jobCount = 0
}: CategorySEOProps): Metadata {
  const categoryNames: Record<string, string> = {
    'tecnologia': 'Tecnología',
    'turismo': 'Turismo',
    'ingenieria': 'Ingeniería',
    'administracion': 'Administración',
    'construccion': 'Construcción',
    'salud': 'Salud',
    'educacion': 'Educación',
    'ventas': 'Ventas',
    'marketing': 'Marketing',
    'logistica': 'Logística'
  }

  const categoryName = categoryNames[category] || category
  const locationText = location || 'Quintana Roo'
  
  const title = generateSEOTitle('category', {
    category: categoryName,
    location: locationText,
    count: jobCount
  })

  const description = generateOptimizedDescription('category', {
    category: categoryName,
    location: locationText,
    count: jobCount
  })

  const keywords = [
    `empleos ${categoryName.toLowerCase()}`,
    `trabajos ${categoryName.toLowerCase()} ${locationText}`,
    `vacantes ${categoryName.toLowerCase()}`,
    `oportunidades ${categoryName.toLowerCase()}`,
    ...generateCategoryKeywords(category, location)
  ]

  const canonical = location 
    ? `https://redtalento.upqroo.edu.mx/vacantes?categoria=${category}&ubicacion=${location}`
    : `https://redtalento.upqroo.edu.mx/vacantes?categoria=${category}`

  const ogImage = `https://redtalento.upqroo.edu.mx/api/og?` + 
    new URLSearchParams({
      title: `Empleos de ${categoryName}`,
      subtitle: `+${jobCount} vacantes en ${locationText}`,
      type: 'category'
    }).toString()

  return generateMetadata({
    title,
    description,
    keywords,
    canonical,
    ogImage
  })
}

export function CategoryStructuredData({ category, location, jobs = [] }: CategorySEOProps) {
  const categoryNames: Record<string, string> = {
    'tecnologia': 'Tecnología',
    'turismo': 'Turismo',
    'ingenieria': 'Ingeniería',
    'administracion': 'Administración'
  }

  const categoryName = categoryNames[category] || category
  const locationText = location || 'Quintana Roo'

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Empleos de ${categoryName} en ${locationText}`,
    "description": `Encuentra las mejores oportunidades laborales de ${categoryName} en ${locationText}. Vacantes para estudiantes y egresados de UPQROO.`,
    "url": location 
      ? `https://redtalento.upqroo.edu.mx/vacantes?categoria=${category}&ubicacion=${location}`
      : `https://redtalento.upqroo.edu.mx/vacantes?categoria=${category}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": jobs.length,
      "itemListElement": jobs.slice(0, 10).map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "JobPosting",
          "title": job.title,
          "hiringOrganization": {
            "@type": "Organization",
            "name": job.company.name
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location || locationText,
              "addressRegion": "Quintana Roo",
              "addressCountry": "MX"
            }
          },
          "url": `https://redtalento.upqroo.edu.mx/vacantes/${job.id}`
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://redtalento.upqroo.edu.mx"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Vacantes",
          "item": "https://redtalento.upqroo.edu.mx/vacantes"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `Empleos de ${categoryName}`,
          "item": `https://redtalento.upqroo.edu.mx/vacantes?categoria=${category}`
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}