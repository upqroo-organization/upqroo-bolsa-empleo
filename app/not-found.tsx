import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-6xl w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Logo Section */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-80 h-80 flex items-center justify-center">
              <Image
                src="/logo_cuadrado.png"
                alt="Logo UPQROO"
                width={320}
                height={320}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Error Content Section */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-upqroo-secondary opacity-30">404</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-upqroo-primary mb-4">
                Página no encontrada
              </h2>
              <p className="text-foreground/70 mb-6">
                Lo sentimos, la página que buscas no existe o ha sido movida.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block w-full lg:w-auto bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-upqroo-dark transition-colors font-medium lg:mr-4"
              >
                Volver al inicio
              </Link>

              <Link
                href="/vacantes"
                className="inline-block w-full lg:w-auto bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-upqroo-accent transition-colors font-medium"
              >
                Ver vacantes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}