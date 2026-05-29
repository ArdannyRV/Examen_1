import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { supabase } from '../supabase'

const Page = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  background-color: #fdfbf7;
`

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.08),
    0 12px 24px -4px rgb(0 0 0 / 0.1);
`

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
`

const Subtitle = styled.p`
  margin: 0 0 1.75rem;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  box-sizing: border-box;

  &:focus {
    border-color: #10b981;
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: #10b981;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`

const Message = styled.p<{ $variant: 'success' | 'error' | 'info' }>`
  margin: 1.25rem 0 0;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
  border-radius: 8px;
  background: ${({ $variant }) =>
    $variant === 'success'
      ? '#fdfbf7'
      : $variant === 'error'
        ? '#fef2f2'
        : '#f9fafb'};
  color: ${({ $variant }) =>
    $variant === 'success'
      ? '#10b981'
      : $variant === 'error'
        ? '#ef4444'
        : '#6b7280'};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'success'
        ? '#10b981'
        : $variant === 'error'
          ? '#fecaca'
          : '#e5e7eb'};
`

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    variant: 'success' | 'error' | 'info'
  } | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          session &&
          (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN')
        ) {
          setSessionReady(true)
        }
      },
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true)
      } else {
        setMessage({
          text: 'Enlace inválido o expirado. Solicita un nuevo correo de restablecimiento desde la app.',
          variant: 'error',
        })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (password.length < 6) {
      setMessage({
        text: 'La contraseña debe tener al menos 6 caracteres.',
        variant: 'error',
      })
      return
    }

    if (!sessionReady) {
      setMessage({
        text: 'No hay una sesión de recuperación activa. Abre el enlace desde tu correo.',
        variant: 'error',
      })
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setMessage({
        text: error.message || 'No se pudo actualizar la contraseña.',
        variant: 'error',
      })
      return
    }

    setMessage({
      text: 'Contraseña actualizada correctamente. Ya puedes volver a la app.',
      variant: 'success',
    })
    setPassword('')
  }

  return (
    <Page>
      <Card>
        <Title>Actualiza tu contraseña</Title>
        <Subtitle>
          Introduce tu nueva contraseña para completar el restablecimiento.
        </Subtitle>

        <form onSubmit={handleSubmit}>
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || !sessionReady}
            autoComplete="new-password"
            minLength={6}
            required
          />

          <Button type="submit" disabled={loading || !sessionReady}>
            {loading ? 'Guardando…' : 'Guardar'}
          </Button>
        </form>

        {message && (
          <Message $variant={message.variant}>{message.text}</Message>
        )}
      </Card>
    </Page>
  )
}
