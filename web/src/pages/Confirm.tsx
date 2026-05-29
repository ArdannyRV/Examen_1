import styled, { keyframes } from 'styled-components'

const Page = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 1.5rem;
`

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  padding: 2.5rem 2rem;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.08),
    0 12px 24px -4px rgb(0 0 0 / 0.1);
`

const popIn = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const CheckCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem;
  font-size: 2.25rem;
  background: #ecfdf5;
  border: 3px solid #10b981;
  border-radius: 50%;
  animation: ${popIn} 0.5s ease-out forwards;
`

const Title = styled.h1`
  margin: 0 0 1rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.4;
`

const Text = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
`

export default function Confirm() {
  return (
    <Page>
      <Card>
        <CheckCircle aria-hidden="true">✅</CheckCircle>
        <Title>¡Cuenta confirmada!</Title>
        <Text>
          ¡Tu cuenta ha sido confirmada con éxito! Ya puedes cerrar esta
          ventana e iniciar sesión en la aplicación de PetAdopt.
        </Text>
      </Card>
    </Page>
  )
}
