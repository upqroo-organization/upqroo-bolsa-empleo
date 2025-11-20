import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Red Talento UPQROO'
    const subtitle = searchParams.get('subtitle') || 'Bolsa de Trabajo Universitaria'
    const type = searchParams.get('type') || 'general'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e40af',
            backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          }}
        >
          {/* Logo UPQROO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>
                UP
              </span>
            </div>
            <div style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>
              Universidad Politécnica de Quintana Roo
            </div>
          </div>

          {/* Título principal */}
          <div
            style={{
              fontSize: type === 'job' ? '48px' : '56px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px',
              maxWidth: '900px',
              lineHeight: '1.2',
            }}
          >
            {title}
          </div>

          {/* Subtítulo */}
          <div
            style={{
              fontSize: '28px',
              color: '#e2e8f0',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: '1.3',
            }}
          >
            {subtitle}
          </div>

          {/* Badge de ubicación */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '25px',
              color: 'white',
              fontSize: '20px',
            }}
          >
            📍 Quintana Roo, México
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              color: '#cbd5e1',
              fontSize: '18px',
            }}
          >
            🌐 redtalento.upqroo.edu.mx
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
    console.log(`Failed to generate the image: ${errorMessage}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}