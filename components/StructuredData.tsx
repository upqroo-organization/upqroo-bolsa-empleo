import { seoConfig } from '@/lib/seo'

interface JobData {
  id: string
  title: string
  description?: string
  company?: { name: string }
  location?: string
  salaryMin?: number
  salaryMax?: number
  type?: string
  createdAt: string
  deadline?: string
  requirements?: string
  responsibilities?: string
}

interface BreadcrumbData {
  items: Array<{ name: string; url: string }>
}

interface StructuredDataProps {
  type: 'organization' | 'website' | 'jobPosting' | 'breadcrumb'
  data?: JobData | BreadcrumbData
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData: Record<string, unknown> = {}

  switch (type) {
    case 'organization':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": seoConfig.organization.name,
        "alternateName": "UPQROO",
        "url": seoConfig.organization.url,
        "logo": seoConfig.organization.logo,
        "description": seoConfig.description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": seoConfig.organization.address.streetAddress,
          "addressLocality": seoConfig.organization.address.addressLocality,
          "addressRegion": seoConfig.organization.address.addressRegion,
          "postalCode": seoConfig.organization.address.postalCode,
          "addressCountry": seoConfig.organization.address.addressCountry
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": seoConfig.organization.contactPoint.telephone,
          "contactType": seoConfig.organization.contactPoint.contactType,
          "availableLanguage": seoConfig.organization.contactPoint.availableLanguage
        },
        "sameAs": [
          seoConfig.social.facebook,
          seoConfig.social.twitter,
          seoConfig.social.linkedin,
          seoConfig.social.instagram
        ]
      }
      break

    case 'website':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": seoConfig.siteName,
        "url": seoConfig.siteUrl,
        "description": seoConfig.description,
        "publisher": {
          "@type": "EducationalOrganization",
          "name": seoConfig.organization.name,
          "logo": seoConfig.organization.logo
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${seoConfig.siteUrl}/vacantes?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
      break

    case 'jobPosting':
      if (data && 'title' in data) {
        const jobData = data as JobData
        structuredData = {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": jobData.title,
          "description": jobData.description,
          "identifier": {
            "@type": "PropertyValue",
            "name": seoConfig.organization.name,
            "value": jobData.id
          },
          "datePosted": jobData.createdAt,
          "validThrough": jobData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          "employmentType": jobData.type?.toUpperCase() || "FULL_TIME",
          "hiringOrganization": {
            "@type": "Organization",
            "name": jobData.company?.name || "Empresa Asociada",
            "sameAs": seoConfig.siteUrl
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": jobData.location || "Quintana Roo",
              "addressRegion": "Quintana Roo",
              "addressCountry": "MX"
            }
          },
          "baseSalary": jobData.salaryMin && jobData.salaryMax ? {
            "@type": "MonetaryAmount",
            "currency": "MXN",
            "value": {
              "@type": "QuantitativeValue",
              "minValue": jobData.salaryMin,
              "maxValue": jobData.salaryMax,
              "unitText": "MONTH"
            }
          } : undefined,
          "qualifications": jobData.requirements || "Estudiante o egresado universitario",
          "responsibilities": jobData.responsibilities || jobData.description,
          "workHours": jobData.type === "partTime" ? "Part-time" : "Full-time"
        }
      }
      break

    case 'breadcrumb':
      if (data && 'items' in data && data.items) {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: { name: string; url: string }, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}