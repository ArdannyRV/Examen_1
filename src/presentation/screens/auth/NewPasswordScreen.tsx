import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { ResetPasswordUseCase } from '@/src/domain/usecases/ResetPasswordUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { GlassCard } from '@/src/presentation/components/ui/Card';
import Button from '@/src/presentation/components/ui/Button';
import Input from '@/src/presentation/components/ui/Input';

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
`;

const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  keyboardShouldPersistTaps: 'handled',
})``;

const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  margin-bottom: 8px;
  margin-top: 4px;
`;

const LinkText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  font-size: 14px;
  font-weight: 500;
`;

export default function NewPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    try {
      const repository = new AuthRepositoryImpl();
      const useCase = new ResetPasswordUseCase(repository);
      await useCase.execute(email);
      Alert.alert('Enlace Enviado', 'Revisa tu correo para cambiar tu contraseña con el apartado de Vercel.', [{ text: 'Entendido', onPress: () => router.back() }]);
    } catch (error: any) {
      console.log('Error atrapado en la UI:', error);
      Alert.alert('Error al enviar', error.message || 'Verifica que el correo sea correcto y vuelve a intentarlo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AnimatedBackground />
      <Scroll>
        <GlassCard>
          <Title>Recuperar Contraseña</Title>
          <Subtitle>Te enviaremos un enlace para restablecerla</Subtitle>

          <LottieView
            source={require('../../../../assets/animations/decoracion_animales.json')}
            autoPlay
            loop
            style={{ width: '100%', height: 200 }}
            resizeMode="contain"
          />

          <Input
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button loading={loading} onPress={handleReset} style={{ marginTop: 24 }}>
            Enviar enlace de recuperación
          </Button>

          <LinkText onPress={() => router.back()}>
            Volver al inicio de sesión
          </LinkText>
        </GlassCard>
      </Scroll>
    </Container>
  );
}
