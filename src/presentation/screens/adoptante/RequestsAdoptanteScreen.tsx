import { useState } from 'react';
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

const HeaderCount = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 6px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 16px;
  margin-horizontal: 20px;
  margin-bottom: 14px;
  flex-direction: row;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 3;
  padding: 16px;
`;

const CardAvatar = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: #e0e7ef;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

const CardBody = styled.View`
  flex: 1;
  justify-content: center;
`;

const CardName = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #11181c;
`;

const CardBreed = styled.Text`
  font-size: 13px;
  color: #687076;
  margin-top: 2px;
`;

const Badge = styled.View<{ status: 'pendiente' | 'aprobada' | 'rechazada' }>`
  align-self: flex-start;
  margin-top: 8px;
  background-color: ${(props) =>
    props.status === 'pendiente'
      ? '#fef3c7'
      : props.status === 'aprobada'
        ? '#d1fae5'
        : '#fee2e2'};
  padding-horizontal: 12px;
  padding-vertical: 4px;
  border-radius: 8px;
`;

const BadgeText = styled.Text<{ status: 'pendiente' | 'aprobada' | 'rechazada' }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) =>
    props.status === 'pendiente'
      ? '#92400e'
      : props.status === 'aprobada'
        ? '#065f46'
        : '#991b1b'};
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #687076;
  text-align: center;
  margin-top: 12px;
`;

interface RequestItem {
  id: string;
  petName: string;
  petBreed: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
}

const mockRequests: RequestItem[] = [
  { id: '1', petName: 'Luna', petBreed: 'Golden Retriever', status: 'pendiente' },
  { id: '2', petName: 'Milo', petBreed: 'Gato Persa', status: 'aprobada' },
];

export default function RequestsAdoptanteScreen() {
  const [requests] = useState<RequestItem[]>(mockRequests);

  return (
    <Container>
      <Header>
        <HeaderTitle>Mis Solicitudes</HeaderTitle>
        <HeaderCount>{requests.length} solicitudes</HeaderCount>
      </Header>

      {requests.length === 0 ? (
        <EmptyState>
          <Ionicons name="document-text-outline" size={64} color="#d0d5dd" />
          <EmptyText>No has realizado solicitudes de adopción aún.</EmptyText>
        </EmptyState>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Card>
              <CardAvatar>
                <Ionicons name="paw" size={28} color="#9ca3af" />
              </CardAvatar>
              <CardBody>
                <CardName>{item.petName}</CardName>
                <CardBreed>{item.petBreed}</CardBreed>
                <Badge status={item.status}>
                  <BadgeText status={item.status}>
                    {item.status === 'pendiente'
                      ? 'Pendiente'
                      : item.status === 'aprobada'
                        ? 'Aprobada'
                        : 'Rechazada'}
                  </BadgeText>
                </Badge>
              </CardBody>
            </Card>
          )}
        />
      )}
    </Container>
  );
}
