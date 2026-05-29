import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { useTheme } from 'styled-components/native';
import type { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

const tabs: { name: string; label: string; icon: IoniconsName }[] = [
  { name: 'lobby', label: 'Explorar', icon: 'search' },
  { name: 'mapa', label: 'Mapa', icon: 'map' },
  { name: 'mascotas', label: 'Mascotas', icon: 'paw' },
  { name: 'asistente', label: 'Asistente', icon: 'chatbubble-ellipses' },
  { name: 'solicitudes', label: 'Solicitudes', icon: 'document-text' },
  { name: 'chats', label: 'Chats', icon: 'chatbubbles' },
];

function TabBarButton(props: {
  children: React.ReactNode;
  onPress?: () => void;
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
        backgroundColor: focused ? theme.colors.primary : 'transparent',
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
  const { role, loading } = useAuth();
  const theme = useTheme();

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
        headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
        headerTransparent: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: theme.colors.textLight,
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
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={focused ? '#fff' : color}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
