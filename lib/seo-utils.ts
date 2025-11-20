// Utilidades SEO adicionales para Red Talento UPQROO

// Función para generar breadcrumbs dinámicos
export function generateBreadcrumbs(path: string, customLabels?: Record<string, string>) {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs = [
    { name: 'Inicio', url: 'https://redtalento.upqroo.edu.mx' }
  ]

  let currentPath = ''
  segments.forEach((segment) => {
    currentPath += `/${segment}`
    
    // Labels personalizados para mejor SEO
    const labels: Record<string, string> = {
      'vacantes': 'Vacantes de Empleo',
      'eventos': 'Eventos de Empleabilidad',
      'empresas-landing': 'Empresas Asociadas',
      'login': 'Iniciar Sesión',
      'signup': 'Registro',
      'terms': 'Términos y Condiciones',
      'autores': 'Acerca de',
      ...customLabels
    }

    const name = labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({
      name,
      url: `https://redtalento.upqroo.edu.mx${currentPath}`
    })
  })

  return breadcrumbs
}

// Función para generar keywords específicas por categoría
export function generateCategoryKeywords(category: string, location?: string) {
  const baseLocation = location || 'Quintana Roo'
  const categoryKeywords: Record<string, string[]> = {
    'tecnologia': [
      `empleos tecnología ${baseLocation}`,
      `trabajos programación ${baseLocation}`,
      `vacantes desarrollo software ${baseLocation}`,
      `empleos sistemas ${baseLocation}`,
      'programador junior',
      'desarrollador web',
      'analista sistemas'
    ],
    'turismo': [
      `empleos turismo ${baseLocation}`,
      `trabajos hotelería ${baseLocation}`,
      `vacantes restaurantes ${baseLocation}`,
      `empleos guía turístico ${baseLocation}`,
      'recepcionista hotel',
      'mesero restaurante',
      'coordinador eventos'
    ],
    'ingenieria': [
      `empleos ingeniería ${baseLocation}`,
      `trabajos construcción ${baseLocation}`,
      `vacantes obra civil ${baseLocation}`,
      `empleos arquitectura ${baseLocation}`,
      'ingeniero civil',
      'arquitecto junior',
      'supervisor obra'
    ],
    'administracion': [
      `empleos administración ${baseLocation}`,
      `trabajos oficina ${baseLocation}`,
      `vacantes recursos humanos ${baseLocation}`,
      `empleos contabilidad ${baseLocation}`,
      'asistente administrativo',
      'contador junior',
      'auxiliar contable'
    ]
  }

  return categoryKeywords[category] || []
}

// Función para generar meta description optimizada
export function generateOptimizedDescription(
  type: 'job' | 'category' | 'location' | 'general',
  data: Record<string, unknown>
) {
  const templates = {
    job: `💼 ${data.title} en ${data.company} - ${data.location || 'Quintana Roo'}. ${data.salary ? `💰 ${data.salary}. ` : ''}🎯 Aplica ahora en Red Talento UPQROO y avanza en tu carrera profesional.`,
    
    category: `🚀 Encuentra empleos de ${data.category} en Quintana Roo. +${data.count || '100'} vacantes activas para estudiantes y egresados de UPQROO. ¡Aplica hoy!`,
    
    location: `📍 Empleos en ${data.location} - Red Talento UPQROO. Oportunidades laborales para universitarios en turismo, tecnología, ingeniería y más. ¡Encuentra tu trabajo ideal!`,
    
    general: '🎯 Red Talento UPQROO - La bolsa de trabajo oficial de la Universidad Politécnica de Quintana Roo. Conectamos estudiantes y egresados con las mejores oportunidades laborales.'
  }

  return templates[type] || templates.general
}

// Función para generar títulos SEO optimizados
export function generateSEOTitle(
  type: 'job' | 'category' | 'location' | 'page',
  data: Record<string, unknown>
) {
  const templates = {
    job: `${data.title} en ${data.company} - Empleos ${data.location || 'Quintana Roo'} | Red Talento UPQROO`,
    
    category: `Empleos de ${data.category} en Quintana Roo - +${data.count || '100'} Vacantes | Red Talento UPQROO`,
    
    location: `Empleos en ${data.location} - Trabajos para Universitarios | Red Talento UPQROO`,
    
    page: `${data.title} - Red Talento UPQROO | Bolsa de Trabajo Universitaria`
  }

  return templates[type] || templates.page
}

// Configuración de headers HTTP para SEO
export const seoHeaders = {
  'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  'Vary': 'Accept-Encoding, User-Agent',
  'Content-Language': 'es-MX',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

// Función para validar y limpiar datos estructurados
export function sanitizeStructuredData(data: Record<string, unknown>) {
  // Remover campos vacíos o nulos
  const cleaned = JSON.parse(JSON.stringify(data, (key, value) => {
    if (value === null || value === undefined || value === '') {
      return undefined
    }
    return value
  }))

  return cleaned
}

// Configuración de URLs canónicas
export function generateCanonicalUrl(path: string, params?: Record<string, string>) {
  const baseUrl = 'https://redtalento.upqroo.edu.mx'
  let url = `${baseUrl}${path}`
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }
  
  return url
}

// Función para generar hreflang (si planeas expandir a otros idiomas)
export function generateHreflang(path: string) {
  return [
    { hreflang: 'es-MX', href: `https://redtalento.upqroo.edu.mx${path}` },
    { hreflang: 'es', href: `https://redtalento.upqroo.edu.mx${path}` },
    { hreflang: 'x-default', href: `https://redtalento.upqroo.edu.mx${path}` }
  ]
}