import { useState } from 'react';
import { Alert, Platform, Modal } from 'react-native';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { RegisterUseCase } from '@/src/domain/usecases/RegisterUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { GlassCard } from '@/src/presentation/components/ui/Card';
import Button from '@/src/presentation/components/ui/Button';
import Input from '@/src/presentation/components/ui/Input';

const Container = styled.KeyboardAvoidingView`
  flex: 1;
`;

const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, padding: 24 },
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

const RoleRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const RoleButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding-vertical: 12px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.border)};
  align-items: center;
  background-color: ${({ active, theme }) => (active ? '#D1FAE5' : 'rgba(255, 255, 255, 0.5)')};
`;

const RoleButtonText = styled.Text<{ active: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ active, theme }) => (active ? theme.colors.primaryDark : theme.colors.textLight)};
`;

const MapButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding-vertical: 14px;
  align-items: center;
  background-color: #D1FAE5;
`;

const MapButtonText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryDark};
`;

const MapCoordsText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primaryDark};
  margin-top: 6px;
  font-weight: 500;
`;

const LinkText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  font-size: 14px;
  font-weight: 500;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.overlay};
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.lg}px;
  height: 85%;
  overflow: hidden;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f3f4f6;
  justify-content: center;
  align-items: center;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
  <style>
    * { margin: 0; padding: 0; }
    body { height: 100vh; width: 100vw; overflow: hidden; }
    #map { height: 100vh; width: 100vw; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map').setView([19.4326, -99.1332], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    let marker;
    map.on('click', function(e) {
      if (marker) map.removeLayer(marker);
      marker = L.marker(e.latlng).addTo(map);
      window.ReactNativeWebView.postMessage(JSON.stringify(e.latlng));
    });
  </script>
</body>
</html>
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
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos obligatorios deben estar llenos.');
      return;
    }
    if (role === 'refugio' && !location.trim()) {
      Alert.alert('Error', 'Debes seleccionar una ubicación en el mapa.');
      return;
    }

    setLoading(true);
    try {
      const repository = new AuthRepositoryImpl();
      const useCase = new RegisterUseCase(repository);
      await useCase.execute(email, password, name, role, location || undefined);
      Alert.alert('Registro Exitoso', 'Verifica tu correo para confirmar tu cuenta', [{ text: 'OK', onPress: () => router.replace('/login') }]);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleMapMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const { lat, lng } = JSON.parse(event.nativeEvent.data);
      setLocation(`${lat.toFixed(4)},${lng.toFixed(4)}`);
      setShowMap(false);
    } catch {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AnimatedBackground />
      <Scroll>
        <GlassCard>
          <Title>Crear Cuenta</Title>
          <Subtitle>Únete a PetAdopt</Subtitle>

          <LottieView
            source={require('../../../../assets/animations/sign.json')}
            autoPlay
            loop
            style={{ width: '100%', height: 150 }}
            resizeMode="contain"
          />

          <Input
            label="Nombre completo"
            placeholder="Ej: Juan Pérez"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <RoleRow>
            {ROLES.map((r) => (
              <RoleButton
                key={r.value}
                active={role === r.value}
                onPress={() => {
                  setRole(r.value);
                  if (r.value === 'adoptante') setLocation('');
                }}
              >
                <RoleButtonText active={role === r.value}>
                  {r.label}
                </RoleButtonText>
              </RoleButton>
            ))}
          </RoleRow>

          {role === 'refugio' && (
            <>
              <MapButton onPress={() => setShowMap(true)} style={{ marginTop: 16 }}>
                <MapButtonText>
                  {location
                    ? 'Cambiar ubicación'
                    : 'Seleccionar ubicación en el mapa'}
                </MapButtonText>
              </MapButton>
              {location ? (
                <MapCoordsText>
                  Lat: {location.split(',')[0]}, Lng: {location.split(',')[1]}
                </MapCoordsText>
              ) : null}
            </>
          )}

          <Button loading={loading} onPress={handleRegister} style={{ marginTop: 24 }}>
            Registrarse
          </Button>

          <LinkText onPress={() => router.replace('/login')}>
            ¿Ya tienes cuenta? Inicia sesión
          </LinkText>
        </GlassCard>
      </Scroll>

      <Modal
        visible={showMap}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMap(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Seleccionar ubicación</ModalTitle>
              <CloseBtn onPress={() => setShowMap(false)}>
                <CloseBtnText>✕</CloseBtnText>
              </CloseBtn>
            </ModalHeader>
            <StyledWebView
              source={{ html: leafletHtml }}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={['*']}
              onMessage={handleMapMessage}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}

const CloseBtnText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 600;
`;
