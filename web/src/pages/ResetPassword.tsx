import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { supabase } from '../supabase'

const Page = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 1.5rem;
`

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.08),
    0 12px 24px -4px rgb(0 0 0 / 0.1);
`

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
`

const Subtitle = styled.p`
  margin: 0 0 1.75rem;
  font-size: 0.9rem;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  color: #1e293b;
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgb(99 102 241 / 0.15);
    background: #fff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;

  &:hover:not(:disabled) {
    opacity: 0.95;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

const Message = styled.p<{ $variant: 'success' | 'error' | 'info' }>`
  margin: 1.25rem 0 0;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
  border-radius: 10px;
  background: ${({ $variant }) =>
    $variant === 'success'
      ? '#ecfdf5'
      : $variant === 'error'
        ? '#fef2f2'
        : '#f1f5f9'};
  color: ${({ $variant }) =>
    $variant === 'success'
      ? '#047857'
      : $variant === 'error'
        ? '#b91c1c'
        : '#475569'};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'success'
        ? '#a7f3d0'
        : $variant === 'error'
          ? '#fecaca'
          : '#e2e8f0'};
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
