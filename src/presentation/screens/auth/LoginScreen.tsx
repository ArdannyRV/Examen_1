import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '@/src/domain/usecases/LoginUseCase';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const repository = new AuthRepositoryImpl();
      const useCase = new LoginUseCase(repository);
      await useCase.execute(email, password);
      router.replace('/(tabs)/lobby');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AnimatedBackground />
      <Scroll>
        <GlassCard>
          <Title>Iniciar Sesión</Title>
          <Subtitle>Bienvenido de vuelta a PetAdopt</Subtitle>

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

          <Input
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button loading={loading} onPress={handleLogin} style={{ marginTop: 24 }}>
            Iniciar Sesión
          </Button>

          <LinkText onPress={() => router.push('/(auth)/new-password')}>
            ¿Olvidaste tu contraseña?
          </LinkText>

          <LinkText onPress={() => router.replace('/(auth)/register')}>
            ¿No tienes cuenta? Regístrate
          </LinkText>
        </GlassCard>
      </Scroll>
    </Container>
  );
}
