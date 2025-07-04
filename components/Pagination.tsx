'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  total: number
  limit: number
  offset: number
  onPageChange: (newOffset: number) => void
  className?: string
}

export function Pagination({
  total,
  limit,
  offset,
  onPageChange,
  className,
}: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const canGoBack = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePage = (page: number) => {
    const newOffset = (page - 1) * limit
    onPageChange(newOffset)
  }

  const renderPageButtons = () => {
    const pages = []

    const maxVisible = 5 // máximo de números visibles antes de usar elipsis
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)

    if (currentPage <= 3) {
      startPage = 1
      endPage = Math.min(totalPages, maxVisible)
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - (maxVisible - 1))
      endPage = totalPages
    }

    // siempre muestra la página 1
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePage(1)}
        >
          1
        </Button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-sm text-muted-foreground">
            …
          </span>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePage(i)}
        >
          {i}
        </Button>
      )
    }

    // siempre muestra la última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-sm text-muted-foreground">
            …
          </span>
        )
      }
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePage(totalPages)}
        >
          {totalPages}
        </Button>
      )
    }

    return pages
  }

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-4 flex-wrap", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePage(currentPage - 1)}
        disabled={!canGoBack}
      >
        Anterior
      </Button>

      {renderPageButtons()}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePage(currentPage + 1)}
        disabled={!canGoNext}
      >
        Siguiente
      </Button>
    </div>
  )
}
