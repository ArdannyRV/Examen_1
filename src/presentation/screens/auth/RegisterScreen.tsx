import { useState } from 'react';
import { Alert, ActivityIndicator, Platform } from 'react-native';
import styled from 'styled-components/native';
import { router } from 'expo-router';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { RegisterUseCase } from '@/src/domain/usecases/RegisterUseCase';

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #0a7ea4;
`;

const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  keyboardShouldPersistTaps: 'handled',
})``;

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

const RoleRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 4px;
`;

const RoleButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding-vertical: 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${(props) => (props.active ? '#0a7ea4' : '#d0d5dd')};
  align-items: center;
  background-color: ${(props) => (props.active ? '#e6f4f9' : '#f9fafb')};
`;

const RoleButtonText = styled.Text<{ active: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => (props.active ? '#0a7ea4' : '#687076')};
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

const ROLES: { label: string; value: 'adoptante' | 'refugio' }[] = [
  { label: 'Adoptante', value: 'adoptante' },
  { label: 'Refugio', value: 'refugio' },
];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'adoptante' | 'refugio'>('adoptante');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos obligatorios deben estar llenos.');
      return;
    }
    if (role === 'refugio' && !location.trim()) {
      Alert.alert('Error', 'La ubicación es obligatoria para refugios.');
      return;
    }

    setLoading(true);
    try {
      const repository = new AuthRepositoryImpl();
      const useCase = new RegisterUseCase(repository);
      await useCase.execute(email, password, name, role, location || undefined);
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Inicia sesión.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
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
      <Scroll>
        <Card>
          <Title>Crear Cuenta</Title>
          <Subtitle>Únete a PetAdopt</Subtitle>

          <Label>Nombre completo</Label>
          <Input
            placeholder="Ej: Juan Pérez"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Label>Rol</Label>
          <RoleRow>
            {ROLES.map((r) => (
              <RoleButton
                key={r.value}
                active={role === r.value}
                onPress={() => setRole(r.value)}
              >
                <RoleButtonText active={role === r.value}>
                  {r.label}
                </RoleButtonText>
              </RoleButton>
            ))}
          </RoleRow>

          {role === 'refugio' && (
            <>
              <Label>Ubicación</Label>
              <Input
                placeholder="Ej: Ciudad de México"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
              />
            </>
          )}

          <Button disabled={loading} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ButtonText>Registrarse</ButtonText>
            )}
          </Button>

          <LinkText onPress={() => router.replace('/login')}>
            ¿Ya tienes cuenta? Inicia sesión
          </LinkText>
        </Card>
      </Scroll>
    </Container>
  );
}
