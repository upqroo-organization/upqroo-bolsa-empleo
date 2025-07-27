"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenError, setTokenError] = useState('')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  useEffect(() => {
    if (!token) {
      setTokenError('Token de recuperación no encontrado')
      setValidatingToken(false)
      return
    }

    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/auth/reset-password?token=${token}`)
      const result = await response.json()

      if (result.valid) {
        setTokenValid(true)
      } else {
        setTokenError(result.message)
      }
    } catch (error) {
      console.error('Token validation error:', error)
      setTokenError('Error al validar el token de recuperación')
    } finally {
      setValidatingToken(false)
    }
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'La contraseña es requerida'
    }
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    return undefined
  }

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) {
      return 'Confirma tu contraseña'
    }
    if (confirmPassword !== password) {
      return 'Las contraseñas no coinciden'
    }
    return undefined
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    
    // Clear error when user starts typing
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    
    // Clear error when user starts typing
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const passwordError = validatePassword(password)
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password)

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError
      })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        toast.success('Contraseña actualizada exitosamente')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?message=password-reset-success')
        }, 3000)
      } else {
        if (response.status === 410) {
          setTokenError('El enlace de recuperación ha expirado')
          setTokenValid(false)
        } else if (response.status === 409) {
          setTokenError('Este enlace ya ha sido utilizado')
          setTokenValid(false)
        } else {
          toast.error(result.message || 'Error al actualizar la contraseña')
        }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-muted-foreground">Validando enlace de recuperación...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Image src="/logo_upqroo.svg" width={480} height={280} alt="Logo UPQROO" className="rounded-lg mx-auto" />
            <h2 className="text-gray-600 mt-2 text-lg font-bold">Bolsa de Trabajo Universitaria</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Enlace Inválido
              </CardTitle>
              <CardDescription>
                No se pudo validar el enlace de recuperación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {tokenError}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Puedes solicitar un nuevo enlace de recuperación desde la página de inicio de sesión.
                </p>
                
                <div className="flex gap-3">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ir al Login
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="flex-1"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Image src="/logo_upqroo.svg" width={480} height={280} alt="Logo UPQROO" className="rounded-lg mx-auto" />
            <h2 className="text-gray-600 mt-2 text-lg font-bold">Bolsa de Trabajo Universitaria</h2>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">¡Contraseña Actualizada!</h3>
                <p className="text-muted-foreground">
                  Tu contraseña ha sido actualizada exitosamente. Serás redirigido al login en unos segundos.
                </p>
                <Link href="/login">
                  <Button className="w-full">
                    Ir al Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image src="/logo_upqroo.svg" width={480} height={280} alt="Logo UPQROO" className="rounded-lg mx-auto" />
          <h2 className="text-gray-600 mt-2 text-lg font-bold">Bolsa de Trabajo Universitaria</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Nueva Contraseña
            </CardTitle>
            <CardDescription>
              Ingresa tu nueva contraseña para completar la recuperación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Contraseña'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login">
                <Button variant="link" className="text-sm">
                  Volver al Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}