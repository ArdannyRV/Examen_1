import { ActivityIndicator, Alert, TouchableOpacity, View, Text } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { useTheme } from 'styled-components/native';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { LogoutUseCase } from '@/src/domain/usecases/LogoutUseCase';
import type { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

const tabs: { name: string; label: string; icon: IoniconsName }[] = [
  { name: 'lobby', label: 'Lobby', icon: 'home' },
  { name: 'mapa', label: 'Mapa', icon: 'map' },
  { name: 'mascotas', label: 'Mascotas', icon: 'paw' },
  { name: 'asistente', label: 'Asistente', icon: 'chatbubble-ellipses' },
  { name: 'solicitudes', label: 'Solicitudes', icon: 'document-text' },
  { name: 'chats', label: 'Chats', icon: 'chatbubbles' },
];

function TabBarButton(props: {
  children: React.ReactNode;
  onPress?: (e: any) => void;
  accessibilityState?: { selected?: boolean };
}) {
  const focused = props.accessibilityState?.selected ?? false;
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: focused ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        borderRadius: 20,
        marginHorizontal: 4,
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
      }}
    >
      {props.children}
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const { user, role, loading } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const authRepo = new AuthRepositoryImpl();
      const logoutUseCase = new LogoutUseCase(authRepo);
      await logoutUseCase.execute();
      router.replace('/(auth)/login');
    } catch {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.primary,
            elevation: 5,
            shadowOpacity: 0.2,
          },
          headerTintColor: '#FFFFFF',
          headerTitleAlign: 'center',
          headerTitle: (props: { children: string }) => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>
                {props.children}
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: -2 }}>
                {user?.user_metadata?.name || (role === 'refugio' ? 'Refugio' : 'Adoptante')}
              </Text>
            </View>
          ),
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            height: 70,
            paddingTop: 6,
            paddingBottom: 8,
          },
          tabBarButton: (props) => <TabBarButton {...props} />,
        }}
      >
        {tabs.map((tab) => {
          let href: string | null = `/${tab.name}`;

          if (tab.name === 'mascotas' && role !== 'refugio') href = null;
          if (tab.name === 'asistente' && role !== 'adoptante') href = null;

          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.label,
                href,
                headerRight: tab.name === 'lobby' ? () => (
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={{ marginRight: 16 }}
                  >
                    <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : undefined,
                tabBarIcon: ({ color }) => (
                  <Ionicons
                    name={tab.icon}
                    size={22}
                    color={color}
                  />
                ),
              }}
            />
          );
        })}
    </Tabs>
  );
}
