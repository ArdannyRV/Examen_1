import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import GlassHeader from '@/src/presentation/components/ui/GlassHeader';
import { MainContainer } from '@/src/presentation/components/ui/Card';

const Container = styled.View`
  flex: 1;
`;

const Card = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  margin-horizontal: 4px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  padding: 14px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 3;
`;

const Avatar = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #e6f4f9;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

const Info = styled.View`
  flex: 1;
`;

const ContactName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const LastMessage = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 3px;
  max-width: 200px;
`;

const Time = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  align-self: flex-start;
`;

const mockChats = [
  {
    id: '1',
    contact: 'Refugio Patitas',
    message: '¡Tu solicitud fue aprobada! Ven a conocer a Luna 🐾',
    time: '10:30 AM',
  },
  {
    id: '2',
    contact: 'Juan Pérez',
    message: 'Hola, me interesa adoptar a Milo. ¿Sigue disponible?',
    time: '9:15 AM',
  },
  {
    id: '3',
    contact: 'María García',
    message: 'Muchas gracias por la información. Saludos!',
    time: 'Ayer',
  },
  {
    id: '4',
    contact: 'Refugio Esperanza',
    message: 'Te recordamos la cita para adoptar este sábado.',
    time: 'Ayer',
  },
  {
    id: '5',
    contact: 'Carlos López',
    message: '¿A qué hora puedo pasar a visitar a los perritos?',
    time: 'Lun',
  },
];

export default function ChatsScreen() {
  return (
    <Container>
      <AnimatedBackground />
      <GlassHeader title="Chats" />

      <MainContainer style={{ paddingHorizontal: 16 }}>
        <FlatList
          data={mockChats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Card activeOpacity={0.95}>
              <Avatar>
                <Ionicons name="person" size={24} color="#10B981" />
              </Avatar>
              <Info>
                <ContactName>{item.contact}</ContactName>
                <LastMessage numberOfLines={1}>{item.message}</LastMessage>
              </Info>
              <Time>{item.time}</Time>
            </Card>
          )}
        />
      </MainContainer>
    </Container>
  );
}
