import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: #f5f7fa;
`;

const Header = styled.View`
  background-color: #0a7ea4;
  padding-top: 60px;
  padding-bottom: 20px;
  padding-horizontal: 20px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

const Card = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 16px;
  margin-horizontal: 20px;
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
  color: #11181c;
`;

const LastMessage = styled.Text`
  font-size: 13px;
  color: #687076;
  margin-top: 3px;
  max-width: 200px;
`;

const Time = styled.Text`
  font-size: 12px;
  color: #9ca3af;
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
      <Header>
        <HeaderTitle>Chats</HeaderTitle>
      </Header>

      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Card activeOpacity={0.95}>
            <Avatar>
              <Ionicons name="person" size={24} color="#0a7ea4" />
            </Avatar>
            <Info>
              <ContactName>{item.contact}</ContactName>
              <LastMessage numberOfLines={1}>{item.message}</LastMessage>
            </Info>
            <Time>{item.time}</Time>
          </Card>
        )}
      />
    </Container>
  );
}
