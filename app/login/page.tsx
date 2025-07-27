'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chrome, Mail, Lock } from "lucide-react"
import { signIn } from 'next-auth/react'
import Image from "next/image"
// import Image from "next/image"
import Link from "next/link"
import { FormEvent, useState } from "react"

export default function LoginPage() {
  const [companyData, setCompanyData] = useState({
    email: '',
    password: ''
  })

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/redirect' })
  }

  const handleCompanySignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!companyData.email || !companyData.password) {
      alert('Por favor, completa todos los campos.')
      return
    }
    try {
      const res = await signIn('credentials', {
        email: companyData.email,
        password: companyData.password,
        callbackUrl: '/redirect'
      })
      if(res?.status === 401) {
        alert('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.')
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image src="logo_upqroo.svg" width={480} height={280} alt="Logo UPQROO" className="rounded-lg" />
          <h2 className="text-gray-600 mt-2 text-lg text-bold">Bolsa de Trabajo Universitaria</h2>
          <h3 className="text-gray-600 mt-2">Atracción Talento</h3>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Estudiante/Egresado</TabsTrigger>
                <TabsTrigger value="company">Empresa</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                <Button onClick={handleGoogleSignIn} className="w-full cursor-pointer" variant="outline">
                  <Chrome className="mr-2 h-4 w-4" />
                  Iniciar sesión
                </Button>
                <div className="text-center text-sm text-gray-500">Usa tu cuenta @upqroo.edu.mx</div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <form className="space-y-4" onSubmit={handleCompanySignIn}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input value={companyData.email} onChange={handleCompanyInputChange} id="email" name="email" type="email" placeholder="empresa@ejemplo.com" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input value={companyData.password} onChange={handleCompanyInputChange} id="password" name="password" type="password" placeholder="••••••••" className="pl-10" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Iniciar Sesión</Button>
                </form>
                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                <Separator className="my-6" />
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">¿No tienes cuenta?</p>
                  <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2025 Universidad Politécnica de Quintana Roo</p>
          <p>Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  )
}
