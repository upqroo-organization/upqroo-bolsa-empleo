"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Building2, MapPin, Clock, DollarSign, Briefcase, Play, Pause } from "lucide-react"
import Link from "next/link"
import { FeaturedJob } from "@/lib/featured-jobs"
import { Careers, VacanteTypeEnum, VacanteModalityEnum } from "@/types/vacantes"
import { getEnumLabelSafe } from "@/utils/index"

interface FeaturedJobsCarouselProps {
  jobs: FeaturedJob[]
}

// Helper function to format salary
function formatSalary(min: number | null, max: number | null): string {
  if (min && max) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  } else if (min) {
    return `Desde $${min.toLocaleString()}`
  } else if (max) {
    return `Hasta $${max.toLocaleString()}`
  }
  return "Salario a convenir"
}

// Helper function to get job tags
function getJobTags(job: FeaturedJob): string[] {
  const tags: string[] = []
  
  if (job.career) {
    const careerLabel = getEnumLabelSafe(Careers, job.career)
    if (careerLabel !== job.career) {
      tags.push(careerLabel)
    }
  }
  
  if (job.type) {
    const typeLabel = getEnumLabelSafe(VacanteTypeEnum, job.type)
    if (typeLabel !== job.type) {
      tags.push(typeLabel)
    }
  }
  
  if (job.modality) {
    const modalityLabel = getEnumLabelSafe(VacanteModalityEnum, job.modality)
    if (modalityLabel !== job.modality) {
      tags.push(modalityLabel)
    }
  }
  
  return tags.slice(0, 3) // Limit to 3 tags
}

export default function FeaturedJobsCarousel({ jobs }: FeaturedJobsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [windowWidth, setWindowWidth] = useState(0)

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize() // Set initial width
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Number of cards to show per view based on screen size
  const getCardsPerView = useCallback(() => {
    if (windowWidth >= 1024) return 3 // lg and above
    if (windowWidth >= 768) return 2  // md and above
    return 1 // mobile
  }, [windowWidth])

  // Calculate total slides
  const getTotalSlides = useCallback(() => {
    const cardsPerView = getCardsPerView()
    return Math.max(1, jobs.length - cardsPerView + 1)
  }, [jobs.length, getCardsPerView])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || jobs.length <= getCardsPerView()) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const totalSlides = getTotalSlides()
        return prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
      })
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, jobs.length, getCardsPerView, getTotalSlides])

  const nextSlide = useCallback(() => {
    const totalSlides = getTotalSlides()
    setCurrentIndex((prevIndex) => 
      prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
    )
  }, [getTotalSlides])

  const prevSlide = useCallback(() => {
    const totalSlides = getTotalSlides()
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? totalSlides - 1 : prevIndex - 1
    )
  }, [getTotalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Reset to first slide when screen size changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [windowWidth])

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold mb-4">No hay vacantes disponibles</h3>
          <p className="text-muted-foreground mb-8">
            Actualmente no hay vacantes publicadas. Te invitamos a registrarte para recibir notificaciones 
            cuando se publiquen nuevas oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">
                Registrarse
              </Button>
            </Link>
            <Link href="/vacantes">
              <Button variant="outline" size="lg">
                Explorar Vacantes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const cardsPerView = getCardsPerView()
  const totalSlides = getTotalSlides()
  const showNavigation = jobs.length > cardsPerView

  return (
    <div className="relative">
      {/* Carousel Header with Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Mostrando {Math.min(jobs.length, 10)} vacantes destacadas
        </div>
        {showNavigation && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAutoPlay}
              className="text-muted-foreground hover:text-foreground"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Reproducir
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-lg"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Responsive Carousel */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` 
          }}
        >
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className={`flex-shrink-0 px-3 ${
                cardsPerView === 1 ? 'w-full' : 
                cardsPerView === 2 ? 'w-1/2' : 'w-1/3'
              }`}
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={prevSlide}
            disabled={currentIndex === 0 && !isAutoPlaying}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1 && !isAutoPlaying}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showNavigation && totalSlides > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {showNavigation && isAutoPlaying && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ 
                width: `${((currentIndex + 1) / totalSlides) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Job Counter and Navigation Info */}
      <div className="text-center mt-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          {showNavigation ? (
            <>
              Diapositiva {currentIndex + 1} de {totalSlides} • 
              {jobs.length} vacante{jobs.length !== 1 ? 's' : ''} disponible{jobs.length !== 1 ? 's' : ''}
            </>
          ) : (
            <>
              {jobs.length} vacante{jobs.length !== 1 ? 's' : ''} destacada{jobs.length !== 1 ? 's' : ''}
            </>
          )}
        </p>
        {showNavigation && (
          <p className="text-xs text-muted-foreground">
            {isAutoPlaying ? 'Reproducción automática activada' : 'Reproducción automática pausada'}
          </p>
        )}
      </div>
    </div>
  )
}

// Job Card Component
function JobCard({ job }: { job: FeaturedJob }) {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Building2 className="h-4 w-4" />
          {job.company.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {job.location} {job.state && `- ${job.state.name}`}
          </div>
          {job.type && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {getEnumLabelSafe(VacanteTypeEnum, job.type)}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <DollarSign className="h-4 w-4" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </div>
        </div>
        
        {job.summary && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.summary}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {getJobTags(job).map((tag, tagIndex) => (
            <Badge key={tagIndex} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Link href={`/vacantes?job=${job.id}`}>
          <Button className="w-full">Ver Detalles</Button>
        </Link>
      </CardContent>
    </Card>
  )
}