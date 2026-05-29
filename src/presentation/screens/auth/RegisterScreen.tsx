import { useState } from 'react';
import { Alert, ActivityIndicator, Platform, Modal } from 'react-native';
import styled from 'styled-components/native';
import { WebView } from 'react-native-webview';
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

const MapButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #0a7ea4;
  border-radius: 10px;
  padding-vertical: 14px;
  align-items: center;
  background-color: #e6f4f9;
`;

const MapButtonText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #0a7ea4;
`;

const MapCoordsText = styled.Text`
  font-size: 13px;
  color: #0a7ea4;
  margin-top: 6px;
  font-weight: 500;
`;

const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
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

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
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
  border-bottom-color: #e5e7eb;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #11181c;
`;

const CloseButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f3f4f6;
  justify-content: center;
  align-items: center;
`;

const CloseButtonText = styled.Text`
  font-size: 18px;
  color: #687076;
  font-weight: 600;
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
      router.replace('/(tabs)/lobby');
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
              <Label>Ubicación del refugio</Label>
              <MapButton onPress={() => setShowMap(true)}>
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

          <SubmitButton disabled={loading} onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ButtonText>Registrarse</ButtonText>
            )}
          </SubmitButton>

          <LinkText onPress={() => router.replace('/login')}>
            ¿Ya tienes cuenta? Inicia sesión
          </LinkText>
        </Card>
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
              <CloseButton onPress={() => setShowMap(false)}>
                <CloseButtonText>✕</CloseButtonText>
              </CloseButton>
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
