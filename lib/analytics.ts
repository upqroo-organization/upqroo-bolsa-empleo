// Google Analytics 4 Configuration for UPQROO Job Board
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Función para enviar eventos a Google Analytics
export const gtag = (...args: unknown[]) => {
  if (typeof window !== 'undefined') {
    const windowWithGtag = window as typeof window & { gtag?: (...args: unknown[]) => void }
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag(...args)
    }
  }
}

// Eventos personalizados para la bolsa de trabajo
export const trackJobView = (jobId: string, jobTitle: string, companyName: string) => {
  gtag('event', 'job_view', {
    job_id: jobId,
    job_title: jobTitle,
    company_name: companyName,
    event_category: 'engagement',
    custom_parameters: {
      content_type: 'job_posting',
      item_id: jobId
    }
  })
}

export const trackJobApplication = (jobId: string, jobTitle: string, companyName: string, userType: string) => {
  gtag('event', 'job_application', {
    job_id: jobId,
    job_title: jobTitle,
    company_name: companyName,
    user_type: userType, // 'student' | 'external'
    event_category: 'conversion',
    value: 1 // Valor de conversión
  })
}

export const trackSearch = (searchTerm: string, resultsCount: number, filters?: Record<string, unknown>) => {
  gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
    event_category: 'engagement',
    custom_parameters: {
      search_filters: filters ? JSON.stringify(filters) : null
    }
  })
}

export const trackCompanyView = (companyId: string, companyName: string) => {
  gtag('event', 'company_view', {
    company_id: companyId,
    company_name: companyName,
    event_category: 'engagement'
  })
}

export const trackUserRegistration = (userType: string, method: string) => {
  gtag('event', 'sign_up', {
    method: method, // 'google' | 'email'
    user_type: userType, // 'student' | 'company' | 'external'
    event_category: 'conversion'
  })
}

export const trackUserLogin = (userType: string, method: string) => {
  gtag('event', 'login', {
    method: method,
    user_type: userType,
    event_category: 'engagement'
  })
}

export const trackCVUpload = (userId: string, fileSize: number) => {
  gtag('event', 'cv_upload', {
    user_id: userId,
    file_size: fileSize,
    event_category: 'engagement'
  })
}

export const trackEventRegistration = (eventId: string, eventTitle: string) => {
  gtag('event', 'event_registration', {
    event_id: eventId,
    event_title: eventTitle,
    event_category: 'conversion'
  })
}

// Configuración de Enhanced Ecommerce para tracking de "productos" (empleos)
export const trackJobImpression = (jobs: Array<{id: string, title: string, company: string, category?: string}>) => {
  gtag('event', 'view_item_list', {
    item_list_id: 'job_listings',
    item_list_name: 'Job Listings',
    items: jobs.map((job, index) => ({
      item_id: job.id,
      item_name: job.title,
      item_category: job.category || 'General',
      item_brand: job.company,
      index: index
    }))
  })
}

// Función para inicializar GA con configuración personalizada
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'user_type',
        custom_parameter_2: 'job_category'
      },
      // Configuración para mejorar el tracking
      send_page_view: true,
      anonymize_ip: true,
      allow_google_signals: true,
      allow_ad_personalization_signals: false
    })
  }
}