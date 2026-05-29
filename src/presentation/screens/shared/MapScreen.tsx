import styled from 'styled-components/native';
import { WebView } from 'react-native-webview';

const Container = styled.View`
  flex: 1;
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
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
  <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script>
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
    L.marker([19.4326, -99.1332])
      .addTo(map)
      .bindPopup('🐾 Refugio PetAdopt - Centro')
      .openPopup();
  </script>
</body>
</html>
`;

export default function MapScreen() {
  return (
    <Container>
      <StyledWebView
        source={{ html: leafletHtml }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
      />
    </Container>
  );
}
