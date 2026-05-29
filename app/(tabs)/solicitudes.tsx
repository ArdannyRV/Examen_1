import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/presentation/context/AuthContext';
import RequestsRefugioScreen from '@/src/presentation/screens/refugio/RequestsRefugioScreen';
import RequestsAdoptanteScreen from '@/src/presentation/screens/adoptante/RequestsAdoptanteScreen';

export default function Solicitudes() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (role === 'refugio') return <RequestsRefugioScreen />;
  return <RequestsAdoptanteScreen />;
}
