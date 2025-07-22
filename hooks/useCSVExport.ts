import { useState } from 'react'
import { toast } from 'sonner'
import { exportToCSV, CSVColumn, CSVExportOptions } from '@/utils/csvExport'

interface UseCSVExportOptions {
  defaultFilename?: string
  onExportStart?: () => void
  onExportSuccess?: (filename: string) => void
  onExportError?: (error: Error) => void
}

interface UseCSVExportReturn {
  isExporting: boolean
  exportData: (data: any[], columns: CSVColumn[], filename?: string) => Promise<void>
  exportWithConfig: (options: CSVExportOptions) => Promise<void>
}

/**
 * Custom hook for CSV export functionality
 * Provides loading states and error handling
 */
export function useCSVExport(options: UseCSVExportOptions = {}): UseCSVExportReturn {
  const [isExporting, setIsExporting] = useState(false)
  
  const {
    defaultFilename = 'export',
    onExportStart,
    onExportSuccess,
    onExportError
  } = options

  const exportData = async (
    data: any[], 
    columns: CSVColumn[], 
    filename?: string
  ): Promise<void> => {
    try {
      setIsExporting(true)
      onExportStart?.()

      if (!data || data.length === 0) {
        throw new Error('No hay datos para exportar')
      }

      const exportOptions: CSVExportOptions = {
        filename: filename || defaultFilename,
        columns,
        data,
        includeTimestamp: true
      }

      exportToCSV(exportOptions)

      const finalFilename = `${exportOptions.filename}_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.csv`
      
      onExportSuccess?.(finalFilename)
      
      toast.success('Exportación exitosa', {
        description: `Se ha descargado el archivo ${finalFilename}`,
        duration: 4000
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      onExportError?.(error as Error)
      
      toast.error('Error en la exportación', {
        description: errorMessage,
        duration: 5000
      })
      
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  const exportWithConfig = async (exportOptions: CSVExportOptions): Promise<void> => {
    try {
      setIsExporting(true)
      onExportStart?.()

      exportToCSV(exportOptions)

      const timestamp = exportOptions.includeTimestamp !== false 
        ? `_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}`
        : ''
      
      const finalFilename = `${exportOptions.filename || defaultFilename}${timestamp}.csv`
      
      onExportSuccess?.(finalFilename)
      
      toast.success('Exportación exitosa', {
        description: `Se ha descargado el archivo ${finalFilename}`,
        duration: 4000
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      onExportError?.(error as Error)
      
      toast.error('Error en la exportación', {
        description: errorMessage,
        duration: 5000
      })
      
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  return {
    isExporting,
    exportData,
    exportWithConfig
  }
}