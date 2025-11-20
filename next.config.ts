import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones para SEO y rendimiento
  compress: true,
  poweredByHeader: false,
  
  // Headers de seguridad y SEO optimizados
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          },
          {
            key: 'Content-Language',
            value: 'es-MX'
          }
        ]
      },
      {
        source: '/vacantes/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600'
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large'
          }
        ]
      },
      {
        source: '/api/og/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300'
          }
        ]
      },
      {
        source: '/(.*)\\.(css|js|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // Redirects para SEO
  async redirects() {
    return [
      {
        source: '/jobs',
        destination: '/vacantes',
        permanent: true,
      },
      {
        source: '/empleos',
        destination: '/vacantes',
        permanent: true,
      },
      {
        source: '/trabajo',
        destination: '/vacantes',
        permanent: true,
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: '/uploads/job-images/:path*',
        destination: '/api/uploads/job-images/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
  
  // Optimización de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['redtalento.upqroo.edu.mx', 'upqroo.edu.mx'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  serverRuntimeConfig: {
    hostname: '0.0.0.0',
    port: 6500
  }
};

export default nextConfig;
