import { useState } from 'react';
import { Alert, ActivityIndicator, Platform } from 'react-native';
import styled from 'styled-components/native';
import { router } from 'expo-router';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '@/src/domain/usecases/LoginUseCase';

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #0a7ea4;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: #11181c;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #687076;
  text-align: center;
  margin-bottom: 24px;
  margin-top: 4px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #11181c;
  margin-bottom: 6px;
  margin-top: 12px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #d0d5dd;
  border-radius: 10px;
  padding-horizontal: 14px;
  padding-vertical: 12px;
  font-size: 16px;
  color: #11181c;
  background-color: #f9fafb;
`;

const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: #0a7ea4;
  border-radius: 10px;
  padding-vertical: 14px;
  align-items: center;
  margin-top: 24px;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;

const LinkText = styled.Text`
  color: #0a7ea4;
  text-align: center;
  margin-top: 16px;
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
      <Card>
        <Title>Iniciar Sesión</Title>
        <Subtitle>Bienvenido de vuelta a PetAdopt</Subtitle>

        <Label>Correo electrónico</Label>
        <Input
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Label>Contraseña</Label>
        <Input
          placeholder="Tu contraseña"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button disabled={loading} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ButtonText>Iniciar Sesión</ButtonText>
          )}
        </Button>

        <LinkText onPress={() => router.replace('/register')}>
          ¿No tienes cuenta? Regístrate
        </LinkText>
      </Card>
    </Container>
  );
}
