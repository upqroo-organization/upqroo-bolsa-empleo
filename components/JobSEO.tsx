import { Metadata } from 'next'
import { generateMetadata } from './SEOHead'
import StructuredData from './StructuredData'

interface JobSEOProps {
  job: {
    id: string
    title: string
    description?: string
    requirements?: string
    responsibilities?: string
    company: {
      name: string
    }
    location?: string
    salaryMin?: number
    salaryMax?: number
    type?: string
    createdAt: string
    deadline?: string
  }
}

export function generateJobMetadata(job: JobSEOProps['job']): Metadata {
  const title = `${job.title} en ${job.company.name} - Red Talento UPQROO`
  const description = job.description 
    ? `💼 ${job.description.substring(0, 140)}... 🎯 Aplica ahora en Red Talento UPQROO y da el siguiente paso en tu carrera.`
    : `💼 Oportunidad laboral: ${job.title} en ${job.company.name}. 📍 Ubicación: ${job.location || 'Quintana Roo'}. 🎯 Aplica ahora en la bolsa de trabajo oficial de UPQROO.`
  
  const keywords = [
    job.title.toLowerCase(),
    job.company.name.toLowerCase(),
    'empleo ' + job.title.toLowerCase(),
    'trabajo ' + job.title.toLowerCase(),
    'vacante ' + job.title.toLowerCase(),
    job.location?.toLowerCase() || 'quintana roo',
    'empleos ' + (job.location?.toLowerCase() || 'quintana roo'),
    'trabajos ' + (job.location?.toLowerCase() || 'quintana roo'),
    'upqroo',
    'bolsa de trabajo',
    'red talento upqroo',
    job.type === 'fullTime' ? 'tiempo completo' : 'medio tiempo',
    'prácticas profesionales'
  ]

  // Generar URL de imagen OG dinámica
  const salaryText = job.salaryMin && job.salaryMax 
    ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} MXN`
    : ''
  
  const ogImageUrl = `https://redtalento.upqroo.edu.mx/api/og/job/${job.id}?` + 
    new URLSearchParams({
      title: job.title,
      company: job.company.name,
      location: job.location || 'Quintana Roo',
      salary: salaryText,
      type: job.type === 'fullTime' ? 'Tiempo Completo' : 'Medio Tiempo'
    }).toString()

  return generateMetadata({
    title,
    description,
    keywords,
    canonical: `https://redtalento.upqroo.edu.mx/vacantes/${job.id}`,
    ogImage: ogImageUrl
  })
}

export function JobStructuredData({ job }: JobSEOProps) {
  return <StructuredData type="jobPosting" data={job} />
}