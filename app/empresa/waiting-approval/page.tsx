'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, AlertCircle } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function WaitingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCompanyStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/company/me');
        const data = await response.json();

        if (data.success) {
          setCompany(data.data);
          
          // If company is approved, redirect to dashboard
          if (data.data.isApprove) {
            router.push('/empresa');
          }
        } else {
          setError(data.error || 'Error al cargar información de la empresa');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'company') {
      checkCompanyStatus();
    } else if (status === 'authenticated' && session?.user?.role !== 'company') {
      router.push('/redirect');
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center text-red-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Intentar nuevamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card>
        <CardHeader className="text-center bg-yellow-50 border-b border-yellow-100">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center">
            <Clock className="h-8 w-8 text-yellow-700" />
          </div>
          <CardTitle className="text-2xl text-yellow-800">Cuenta en Revisión</CardTitle>
          <CardDescription className="text-yellow-700">
            Tu empresa está pendiente de aprobación
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              ¡Gracias por registrar tu empresa!
            </h2>
            <p className="text-gray-600">
              Hemos recibido tu solicitud para {company?.name} y está siendo revisada por nuestro equipo de coordinación.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">¿Qué sigue?</h3>
            <ol className="space-y-3 text-blue-700">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <span className="block h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
                </div>
                <span>Nuestro equipo está revisando la información de tu empresa</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <span className="block h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
                </div>
                <span>Recibirás un correo electrónico cuando tu cuenta sea aprobada</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <span className="block h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
                </div>
                <span>Una vez aprobada, podrás publicar vacantes y acceder a todas las funciones</span>
              </li>
            </ol>
          </div>

          <div className="border-t pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p>Fecha de solicitud: {company?.createdAt ? new Date(company.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Cargando...'}</p>
                <p>Tiempo estimado de respuesta: 1-2 días hábiles</p>
              </div>
              <Button variant="outline" onClick={() => signOut()}>
                Cerrar Sesión
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mt-4">
            <p>
              Si tienes alguna pregunta o necesitas actualizar la información de tu empresa, 
              por favor contáctanos a <a href="mailto:gestionempresarial@upqroo.edu.mx" className="text-blue-600 hover:underline">gestionempresarial@upqroo.edu.mx</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}