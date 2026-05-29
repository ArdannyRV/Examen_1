import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { UserRepositoryImpl } from '@/src/data/repositories/UserRepositoryImpl';
import { GetRefugiosUseCase } from '@/src/domain/usecases/GetRefugiosUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import GlassHeader from '@/src/presentation/components/ui/GlassHeader';
import { MainContainer } from '@/src/presentation/components/ui/Card';

const Container = styled.View`
  flex: 1;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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

function buildLeafletHtml(refugios: { name: string; location: string }[]): string {
  const markerScript = refugios
    .map((r) => {
      const [lat, lng] = r.location.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) return '';
      return `L.marker([${lat}, ${lng}]).addTo(map).bindPopup('🐾 ${r.name.replace(/'/g, "\\'")}');`;
    })
    .filter(Boolean)
    .join('\n');

  const firstMarker = refugios.length > 0
    ? refugios.map((r) => r.location.split(',').map(Number)).find((c) => c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]))
    : null;

  const centerLat = firstMarker?.[0] ?? 19.4326;
  const centerLng = firstMarker?.[1] ?? -99.1332;

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
    const map = L.map('map').setView([${centerLat}, ${centerLng}], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    ${markerScript}
  </script>
</body>
</html>`;
}

export default function MapScreen() {
  const theme = useTheme();
  const [refugios, setRefugios] = useState<{ name: string; location: string }[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Container>
        <AnimatedBackground />
        <Loader>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Loader>
      </Container>
    );
  }

  return (
    <Container>
      <AnimatedBackground />
      <GlassHeader
        title="Refugios Cercanos"
        leftIcon={
          <Ionicons name="map" size={22} color="#10B981" />
        }
      />

      <MainContainer>
        <MapWrapper>
          <StyledWebView
            source={{ html: buildLeafletHtml(refugios) }}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
          />
        </MapWrapper>
      </MainContainer>
    </Container>
  );
}
