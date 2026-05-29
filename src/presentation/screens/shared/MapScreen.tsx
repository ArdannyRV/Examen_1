import { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { UserRepositoryImpl } from '@/src/data/repositories/UserRepositoryImpl';
import { GetRefugiosUseCase } from '@/src/domain/usecases/GetRefugiosUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import LoadingGato from '@/src/presentation/components/ui/LoadingGato';
import { MainContainer } from '@/src/presentation/components/ui/Card';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const MapWrapper = styled.View`
  flex: 1;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

function buildLeafletHtml(
  refugios: { name: string; location: string }[],
  userLocation: { lat: number; lng: number }
): string {
  const markerScript = refugios
    .map((r) => {
      const [lat, lng] = r.location.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) return '';
      return `L.marker([${lat}, ${lng}]).addTo(map).bindPopup('🐾 ${r.name.replace(/'/g, "\\'")}');`;
    })
    .filter(Boolean)
    .join('\n');

  return `
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
    const map = L.map('map').setView([${userLocation.lat}, ${userLocation.lng}], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    L.circleMarker([${userLocation.lat}, ${userLocation.lng}], {
      color: '#3B82F6',
      radius: 8,
      fillOpacity: 1
    }).addTo(map).bindPopup('Mi Ubicaci\u00F3n');
    ${markerScript}
  </script>
</body>
</html>`;
}

export default function MapScreen() {
  const theme = useTheme();
  const [refugios, setRefugios] = useState<{ name: string; location: string }[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocation({ lat: -0.180653, lng: -78.467838 });
        setLocationLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: location.coords.latitude, lng: location.coords.longitude });
      setLocationLoading(false);
    })();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const repository = new UserRepositoryImpl();
        const useCase = new GetRefugiosUseCase(repository);
        const data = await useCase.execute();
        setRefugios(
          data
            .filter((r) => r.location)
            .map((r) => ({ name: r.name, location: r.location! }))
        );
      } catch {
        // silently fail
      } finally {
        setDataLoading(false);
      }
    };
    load();
  }, []);

  if (!userLocation || locationLoading || dataLoading) {
    return (
      <Container>
        <AnimatedBackground />
        <LoadingGato />
      </Container>
    );
  }

  return (
    <Container>
      <AnimatedBackground />
      <MainContainer>
        <MapWrapper>
          <StyledWebView
            source={{ html: buildLeafletHtml(refugios, userLocation) }}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
          />
        </MapWrapper>
      </MainContainer>
    </Container>
  );
}
