// SEO Configuration for UPQROO Bolsa de Trabajo
export const seoConfig = {
    // Información básica del sitio
    siteName: "Red Talento UPQROO - Bolsa de Trabajo Universitaria",
    siteUrl: "https://redtalento.upqroo.edu.mx",
    description: "Plataforma oficial de empleos de la Universidad Politécnica de Quintana Roo. Conectamos estudiantes y egresados con las mejores oportunidades laborales en Quintana Roo y México.",

    // Palabras clave principales optimizadas para SEO local
    keywords: [
        // Palabras clave principales
        "bolsa de trabajo UPQROO",
        "empleos Quintana Roo",
        "trabajos Cancún",
        "vacantes Playa del Carmen",
        "Universidad Politécnica Quintana Roo",
        "red talento UPQROO",

        // Long-tail keywords específicas
        "empleos para estudiantes universitarios Quintana Roo",
        "prácticas profesionales Cancún",
        "trabajos turismo Riviera Maya",
        "empleos ingeniería Quintana Roo",
        "vacantes tecnología Cancún",
        "oportunidades laborales egresados UPQROO",
        "empleos tiempo completo Quintana Roo",
        "trabajos medio tiempo estudiantes",
        "bolsa trabajo universitaria México",

        // Sectores específicos de Quintana Roo
        "empleos hotelería Cancún",
        "trabajos restaurantes Playa del Carmen",
        "vacantes construcción Quintana Roo",
        "empleos logística Cancún",
        "trabajos administración turística",
        "empleos desarrollo software Quintana Roo",
        "vacantes marketing digital Cancún",
        "empleos recursos humanos Riviera Maya"
    ],

    // Información de contacto y organización
    organization: {
        name: "Universidad Politécnica de Quintana Roo",
        url: "https://upqroo.edu.mx",
        logo: "https://redtalento.upqroo.edu.mx/logo_upqroo.svg",
        address: {
            streetAddress: "Av. Arco Bicentenario, Mza. 401, Lte. 1, Ejido de Cancún",
            addressLocality: "Cancún",
            addressRegion: "Quintana Roo",
            postalCode: "77086",
            addressCountry: "MX"
        },
        contactPoint: {
            telephone: "+52-998-387-0700",
            contactType: "customer service",
            availableLanguage: "Spanish"
        }
    },

    // Configuración de redes sociales
    social: {
        facebook: "https://www.facebook.com/upqroo.oficial",
        twitter: "https://twitter.com/upqroo_oficial",
        linkedin: "https://www.linkedin.com/school/universidad-politecnica-de-quintana-roo",
        instagram: "https://www.instagram.com/upqroo_oficial"
    },

    // Configuración de Open Graph
    openGraph: {
        type: "website",
        locale: "es_MX",
        siteName: "Red Talento UPQROO"
    }
}

// Metadatos optimizados por página
export const pageMetadata = {
    home: {
        title: "Red Talento UPQROO - Bolsa de Trabajo Universitaria | Empleos en Quintana Roo",
        description: "🎯 Encuentra tu próximo empleo en Quintana Roo. Plataforma oficial de la UPQROO que conecta estudiantes y egresados con empresas. +500 vacantes activas en turismo, tecnología, ingeniería y más.",
        keywords: "bolsa trabajo UPQROO, empleos Quintana Roo, trabajos Cancún, vacantes universitarias, red talento"
    },

    jobs: {
        title: "Vacantes de Empleo - Red Talento UPQROO | +500 Trabajos en Quintana Roo",
        description: "🚀 Explora cientos de oportunidades laborales en Quintana Roo. Empleos de tiempo completo, medio tiempo y prácticas profesionales para estudiantes y egresados de UPQROO. ¡Aplica hoy!",
        keywords: "vacantes empleo, trabajos Quintana Roo, empleos Cancún, oportunidades laborales, prácticas profesionales"
    },

    companies: {
        title: "Empresas Asociadas - Red Talento UPQROO | Reclutamiento en Quintana Roo",
        description: "🏢 Descubre las mejores empresas de Quintana Roo que confían en el talento UPQROO. Conecta con empleadores líderes en turismo, tecnología, construcción y más sectores.",
        keywords: "empresas Quintana Roo, reclutamiento, empleadores Cancún, empresas turismo"
    },

    events: {
        title: "Eventos de Empleabilidad - Red Talento UPQROO | Ferias de Empleo Quintana Roo",
        description: "📅 Participa en ferias de empleo, talleres de empleabilidad y eventos de networking en Quintana Roo. Conecta directamente con reclutadores y empresas.",
        keywords: "ferias empleo Quintana Roo, eventos empleabilidad, networking, talleres trabajo"
    },

    login: {
        title: "Iniciar Sesión - Red Talento UPQROO | Acceso Estudiantes y Empresas",
        description: "🔐 Accede a tu cuenta en Red Talento UPQROO. Estudiantes: busca empleos y gestiona aplicaciones. Empresas: publica vacantes y encuentra talento universitario.",
        keywords: "login UPQROO, acceso bolsa trabajo, iniciar sesión estudiantes"
    },

    signup: {
        title: "Registro - Red Talento UPQROO | Únete a la Bolsa de Trabajo Universitaria",
        description: "✅ Regístrate gratis en Red Talento UPQROO. Estudiantes: accede a cientos de empleos. Empresas: encuentra el mejor talento universitario de Quintana Roo.",
        keywords: "registro UPQROO, crear cuenta bolsa trabajo, registro estudiantes empresas"
    }
}

// Configuración para diferentes tipos de contenido
export const contentTypes = {
    jobPosting: {
        titleTemplate: "{jobTitle} en {companyName} - Red Talento UPQROO",
        descriptionTemplate: "💼 {jobTitle} en {companyName}, {location}. {salary} Aplica ahora en Red Talento UPQROO y da el siguiente paso en tu carrera profesional.",
    },

    companyProfile: {
        titleTemplate: "{companyName} - Empleos y Vacantes | Red Talento UPQROO",
        descriptionTemplate: "🏢 Descubre las oportunidades laborales en {companyName}. Vacantes activas, información de la empresa y proceso de aplicación en Red Talento UPQROO.",
    }
}