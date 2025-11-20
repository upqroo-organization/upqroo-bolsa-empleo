import { MetadataRoute } from 'next'
import { seoConfig } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl

  // URLs estáticas principales con prioridades optimizadas
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vacantes`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/eventos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/empresas-landing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Páginas de categorías de empleos (para SEO)
    {
      url: `${baseUrl}/vacantes?categoria=tecnologia`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vacantes?categoria=turismo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vacantes?categoria=ingenieria`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vacantes?categoria=administracion`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Páginas de ubicaciones (para SEO local)
    {
      url: `${baseUrl}/vacantes?ubicacion=cancun`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vacantes?ubicacion=playa-del-carmen`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vacantes?ubicacion=cozumel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    // Páginas de autenticación y registro
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Páginas informativas
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/autores`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // TODO: Agregar URLs dinámicas de vacantes activas
  // Ejemplo de cómo agregar URLs dinámicas cuando tengas acceso a la DB:
  /*
  try {
    const activeJobs = await prisma.vacante.findMany({
      where: { 
        isActive: true,
        deadline: { gte: new Date() }
      },
      select: { 
        id: true, 
        updatedAt: true,
        title: true 
      },
      take: 1000 // Limitar para evitar sitemaps muy grandes
    })

    const jobUrls: MetadataRoute.Sitemap = activeJobs.map(job => ({
      url: `${baseUrl}/vacantes/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const activeEvents = await prisma.evento.findMany({
      where: { 
        isActive: true,
        fechaEvento: { gte: new Date() }
      },
      select: { 
        id: true, 
        updatedAt: true 
      },
      take: 100
    })

    const eventUrls: MetadataRoute.Sitemap = activeEvents.map(event => ({
      url: `${baseUrl}/eventos/${event.id}`,
      lastModified: event.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [...staticUrls, ...jobUrls, ...eventUrls]
  } catch (error) {
    console.error('Error generating dynamic sitemap URLs:', error)
    return staticUrls
  }
  */

  return staticUrls
}