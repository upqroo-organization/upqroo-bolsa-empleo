/**
 * Utility functions for CSV export functionality
 * Reusable across different views and database tables
 */

export interface CSVColumn {
  key: string
  label: string
  transform?: (value: any) => string
}

export interface CSVExportOptions {
  filename?: string
  columns: CSVColumn[]
  data: any[]
  includeTimestamp?: boolean
}

/**
 * Converts data to CSV format
 */
export function convertToCSV(data: any[], columns: CSVColumn[]): string {
  if (!data || data.length === 0) {
    return ''
  }

  // Create header row
  const headers = columns.map(col => `"${col.label}"`).join(',')

  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = getNestedValue(item, col.key)

      // Apply transformation if provided
      if (col.transform && value !== null && value !== undefined) {
        value = col.transform(value)
      }

      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = ''
      }

      // Convert to string and escape quotes
      const stringValue = String(value).replace(/"/g, '""')
      return `"${stringValue}"`
    }).join(',')
  })

  return [headers, ...rows].join('\n')
}

/**
 * Downloads CSV file to user's device
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  URL.revokeObjectURL(url)
}

/**
 * Main export function - combines CSV conversion and download
 */
export function exportToCSV(options: CSVExportOptions): void {
  const {
    filename = 'export',
    columns,
    data,
    includeTimestamp = true
  } = options

  if (!data || data.length === 0) {
    throw new Error('No hay datos para exportar')
  }

  if (!columns || columns.length === 0) {
    throw new Error('No se han definido columnas para la exportación')
  }

  // Generate CSV content
  const csvContent = convertToCSV(data, columns)

  // Generate filename with timestamp if requested
  const timestamp = includeTimestamp
    ? `_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}`
    : ''

  const finalFilename = `${filename}${timestamp}.csv`

  // Download the file
  downloadCSV(csvContent, finalFilename)
}

/**
 * Helper function to get nested object values using dot notation
 * Example: getNestedValue(obj, 'user.profile.name')
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

/**
 * Common date transformation functions
 */
export const dateTransforms = {
  // Format date as DD/MM/YYYY
  toDateString: (date: string | Date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('es-ES')
  },

  // Format date as DD/MM/YYYY HH:MM
  toDateTimeString: (date: string | Date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleString('es-ES')
  },

  // Format date as YYYY-MM-DD
  toISODateString: (date: string | Date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }
}

/**
 * Common value transformation functions
 */
export const valueTransforms = {
  // Convert boolean to Sí/No
  booleanToSpanish: (value: boolean) => {
    return value ? 'Sí' : 'No'
  },

  // Convert null/undefined to empty string
  nullToEmpty: (value: any) => {
    return value === null || value === undefined ? '' : String(value)
  },

  // Capitalize first letter
  capitalize: (value: string) => {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  },

  // Format approval status to Spanish
  approvalStatusToSpanish: (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'approved': 'Aprobada',
      'rejected': 'Rechazada'
    }
    return statusMap[status] || status
  }
}

/**
 * Predefined column configurations for common entities
 */
export const commonColumnConfigs = {
  companies: [
    { key: 'name', label: 'Nombre de la Empresa' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'rfc', label: 'RFC' },
    { key: 'industry', label: 'Sector' },
    { key: 'state.name', label: 'Estado' },
    { key: 'contactName', label: 'Contacto Principal' },
    { key: 'contactEmail', label: 'Email de Contacto' },
    { key: 'phone', label: 'Teléfono' },
    {
      key: 'approvalStatus',
      label: 'Estado de Aprobación',
      transform: valueTransforms.approvalStatusToSpanish
    },
    {
      key: 'createdAt',
      label: 'Fecha de Registro',
      transform: dateTransforms.toDateString
    },
    {
      key: 'updatedAt',
      label: 'Última Actualización',
      transform: dateTransforms.toDateString
    }
  ] as CSVColumn[],

  users: [
    { key: 'name', label: 'Nombre Completo' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'role.name', label: 'Rol' },
    {
      key: 'createdAt',
      label: 'Fecha de Registro',
      transform: dateTransforms.toDateString
    }
  ] as CSVColumn[],

  vacantes: [
    { key: 'title', label: 'Título de la Vacante' },
    { key: 'company.name', label: 'Empresa' },
    { key: 'location', label: 'Ubicación' },
    { key: 'type', label: 'Tipo' },
    { key: 'modality', label: 'Modalidad' },
    { key: 'salaryMin', label: 'Salario Mínimo' },
    { key: 'salaryMax', label: 'Salario Máximo' },
    {
      key: 'createdAt',
      label: 'Fecha de Publicación',
      transform: dateTransforms.toDateString
    }
  ] as CSVColumn[]
}