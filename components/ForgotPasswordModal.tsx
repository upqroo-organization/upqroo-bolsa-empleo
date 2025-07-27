"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email
    if (!email.trim()) {
      setErrors({ email: 'El correo electrónico es requerido' })
      return
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Por favor ingresa un correo electrónico válido' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        toast.success('Correo de recuperación enviado')
      } else {
        toast.error(result.message || 'Error al enviar el correo de recuperación')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setErrors({})
    setSuccess(false)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Recuperar Contraseña
          </DialogTitle>
          <DialogDescription>
            {success 
              ? "Te hemos enviado un correo con las instrucciones para restablecer tu contraseña."
              : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
            }
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6">
              <div className="text-center space-y-3">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold">¡Correo enviado!</h3>
                <p className="text-sm text-muted-foreground">
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-xs text-muted-foreground">
                  El enlace expirará en 1 hora.
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="empresa@ejemplo.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Enlace'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}