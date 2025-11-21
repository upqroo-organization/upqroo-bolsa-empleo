// Example: Creating an external vacante from a coordinator dashboard

'use client'

import { useState } from 'react'

export function CreateExternalVacanteForm() {
  const [isImageOnly, setIsImageOnly] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const data = {
      title: formData.get('title'),
      externalCompanyName: formData.get('externalCompanyName'),
      externalCompanyEmail: formData.get('externalCompanyEmail'),
      externalCompanyPhone: formData.get('externalCompanyPhone'),
      imageUrl: formData.get('imageUrl'),
      isImageOnly,
      location: formData.get('location'),
      career: formData.get('career'),
      type: formData.get('type'),
      modality: formData.get('modality'),
      deadline: formData.get('deadline'),
      stateId: formData.get('stateId'),
      // Only include these if not image-only
      ...(!isImageOnly && {
        summary: formData.get('summary'),
        description: formData.get('description'),
        responsibilities: formData.get('responsibilities'),
      })
    }

    try {
      const response = await fetch('/api/coordinador/vacantes/external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Vacante externa creada exitosamente')
        // Reset form or redirect
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating external vacante:', error)
      alert('Error al crear la vacante')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Crear Vacante Externa</h2>

      {/* Toggle between image-only and detailed */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isImageOnly"
          checked={isImageOnly}
          onChange={(e) => setIsImageOnly(e.target.checked)}
        />
        <label htmlFor="isImageOnly">
          Solo imagen (para flyers o carteles)
        </label>
      </div>

      {/* Required fields */}
      <div>
        <label htmlFor="title">Título de la vacante *</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="externalCompanyName">Nombre de la empresa *</label>
        <input
          type="text"
          id="externalCompanyName"
          name="externalCompanyName"
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="externalCompanyEmail">Email de contacto</label>
        <input
          type="email"
          id="externalCompanyEmail"
          name="externalCompanyEmail"
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="externalCompanyPhone">Teléfono de contacto</label>
        <input
          type="tel"
          id="externalCompanyPhone"
          name="externalCompanyPhone"
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="imageUrl">URL de la imagen {isImageOnly && '*'}</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          required={isImageOnly}
          placeholder="/uploads/job-images/poster.jpg"
          className="w-full border rounded p-2"
        />
      </div>

      {/* Optional fields */}
      <div>
        <label htmlFor="location">Ubicación</label>
        <input
          type="text"
          id="location"
          name="location"
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="career">Carrera</label>
        <input
          type="text"
          id="career"
          name="career"
          placeholder="Ej: Ingeniería en Software"
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="type">Tipo de empleo</label>
        <select id="type" name="type" className="w-full border rounded p-2">
          <option value="">Seleccionar...</option>
          <option value="Full-time">Tiempo completo</option>
          <option value="Part-time">Medio tiempo</option>
          <option value="Internship">Prácticas</option>
        </select>
      </div>

      <div>
        <label htmlFor="modality">Modalidad</label>
        <select id="modality" name="modality" className="w-full border rounded p-2">
          <option value="">Seleccionar...</option>
          <option value="Remote">Remoto</option>
          <option value="On-site">Presencial</option>
          <option value="Hybrid">Híbrido</option>
        </select>
      </div>

      <div>
        <label htmlFor="deadline">Fecha límite</label>
        <input
          type="datetime-local"
          id="deadline"
          name="deadline"
          className="w-full border rounded p-2"
        />
      </div>

      {/* Detailed fields - only show if not image-only */}
      {!isImageOnly && (
        <>
          <div>
            <label htmlFor="summary">Resumen *</label>
            <textarea
              id="summary"
              name="summary"
              required
              rows={3}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label htmlFor="responsibilities">Responsabilidades *</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              required
              rows={5}
              className="w-full border rounded p-2"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Vacante Externa'}
      </button>
    </form>
  )
}

// Example: Displaying vacantes with external company support

export function VacanteCard({ vacante }: { vacante: any }) {
  // Determine company name and logo
  const companyName = vacante.isExternal
    ? vacante.externalCompanyName
    : vacante.company?.name

  const companyLogo = vacante.isExternal
    ? null // External companies don't have logos
    : vacante.company?.logoUrl

  return (
    <div className="border rounded-lg p-4 shadow">
      <div className="flex items-start gap-4">
        {companyLogo && (
          <img
            src={companyLogo}
            alt={companyName}
            className="w-16 h-16 object-contain"
          />
        )}

        <div className="flex-1">
          <h3 className="text-xl font-bold">{vacante.title}</h3>
          <p className="text-gray-600">{companyName}</p>

          {vacante.isExternal && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
              Empresa Externa
            </span>
          )}

          {vacante.isImageOnly && (
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mt-1 ml-2">
              Ver Imagen
            </span>
          )}

          {vacante.location && (
            <p className="text-sm text-gray-500 mt-2">📍 {vacante.location}</p>
          )}

          {vacante.isImageOnly && vacante.imageUrl ? (
            <div className="mt-4">
              <img
                src={vacante.imageUrl}
                alt={vacante.title}
                className="max-w-full h-auto rounded"
              />
            </div>
          ) : (
            <p className="mt-2 text-gray-700">{vacante.summary}</p>
          )}

          {vacante.isExternal && vacante.externalCompanyEmail && (
            <p className="text-sm text-gray-600 mt-2">
              📧 Contacto: {vacante.externalCompanyEmail}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
