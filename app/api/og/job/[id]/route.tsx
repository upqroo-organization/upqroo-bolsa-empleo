import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Oportunidad Laboral'
    const company = searchParams.get('company') || 'Empresa'
    const location = searchParams.get('location') || 'Quintana Roo'
    const salary = searchParams.get('salary') || ''
    const type = searchParams.get('type') || 'Tiempo Completo'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '40px 60px',
              backgroundColor: '#1e40af',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                  UP
                </span>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Red Talento UPQROO</div>
                <div style={{ fontSize: '16px', opacity: 0.9 }}>Bolsa de Trabajo Universitaria</div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '16px',
              }}
            >
              💼 {type}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '60px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Job Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '20px',
                lineHeight: '1.2',
              }}
            >
              {title}
            </div>

            {/* Company */}
            <div
              style={{
                fontSize: '32px',
                color: '#475569',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              🏢 {company}
            </div>

            {/* Details */}
            <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '24px',
                  color: '#64748b',
                }}
              >
                📍 {location}
              </div>
              {salary && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '24px',
                    color: '#059669',
                    fontWeight: '600',
                  }}
                >
                  💰 {salary}
                </div>
              )}
            </div>

            {/* CTA */}
            <div
              style={{
                backgroundColor: '#1e40af',
                color: 'white',
                padding: '20px 40px',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: '600',
                alignSelf: 'flex-start',
                marginTop: 'auto',
              }}
            >
              ¡Aplica Ahora!
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '20px 60px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px',
              color: '#64748b',
            }}
          >
            🌐 redtalento.upqroo.edu.mx • Universidad Politécnica de Quintana Roo
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    console.log(`Failed to generate job image: ${errorMessage}`)
    return new Response(`Failed to generate job image`, {
      status: 500,
    })
  }
}