import { ActivityIndicator, View } from 'react-native';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/presentation/context/AuthContext';
import type { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface TabDef {
  name: string;
  label: string;
  icon: IoniconsName;
  roles: ('adoptante' | 'refugio')[];
}

const allTabs: TabDef[] = [
  { name: 'lobby', label: 'Explorar', icon: 'search', roles: ['adoptante', 'refugio'] },
  { name: 'mapa', label: 'Mapa', icon: 'map', roles: ['adoptante', 'refugio'] },
  { name: 'mascotas', label: 'Mascotas', icon: 'paw', roles: ['refugio'] },
  { name: 'asistente', label: 'Asistente', icon: 'chatbubble-ellipses', roles: ['adoptante'] },
  { name: 'solicitudes', label: 'Solicitudes', icon: 'document-text', roles: ['adoptante', 'refugio'] },
  { name: 'perfil', label: 'Perfil', icon: 'person', roles: ['adoptante', 'refugio'] },
];

function TabBarButton(props: {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityState?: { selected?: boolean };
}) {
  const focused = props.accessibilityState?.selected ?? false;

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: focused ? '#0d9488' : 'transparent',
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  const visibleTabs = allTabs.filter((t) => role && t.roles.includes(role));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#687076',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
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
      {visibleTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={tab.icon}
                size={22}
                color={focused ? '#fff' : color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
