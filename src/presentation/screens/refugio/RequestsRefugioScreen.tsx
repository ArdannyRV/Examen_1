import { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import type { AdoptionRequest } from '@/src/domain/entities/AdoptionRequest';

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

const Card = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 16px;
  margin-horizontal: 20px;
  margin-bottom: 14px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 3;
`;

const CardSummary = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
`;

const AvatarCircle = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #e6f4f9;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

const SummaryInfo = styled.View`
  flex: 1;
`;

const SummaryName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #11181c;
`;

const SummaryPet = styled.Text`
  font-size: 13px;
  color: #687076;
  margin-top: 2px;
`;

const Badge = styled.View<{ status: 'pendiente' | 'aprobada' | 'rechazada' }>`
  background-color: ${(props) =>
    props.status === 'pendiente'
      ? '#fef3c7'
      : props.status === 'aprobada'
        ? '#d1fae5'
        : '#fee2e2'};
  padding-horizontal: 10px;
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

const ExpandedSection = styled.View`
  padding-horizontal: 16px;
  padding-bottom: 16px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #e5e7eb;
  margin-bottom: 14px;
`;

const DetailLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #687076;
  margin-bottom: 4px;
`;

const DetailText = styled.Text`
  font-size: 14px;
  color: #11181c;
  margin-bottom: 14px;
  line-height: 20px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 4px;
`;

const AcceptButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #059669;
  border-radius: 10px;
  padding-vertical: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const AcceptButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;

const RejectButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #dc2626;
  border-radius: 10px;
  padding-vertical: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const RejectButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
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

const initialRequests: AdoptionRequest[] = [
  {
    id: 'rq1',
    pet_id: '1',
    adoptante_id: 'a1',
    status: 'pendiente',
    pet_name: 'Luna',
    pet_breed: 'Golden Retriever',
    adoptante_name: 'María García',
    adoptante_experience:
      'He tenido perros desde pequeño. Actualmente vivo en una casa con patio grande y trabajo desde casa, por lo que puedo dedicarle mucho tiempo. Estoy buscando un compañero para salir a correr.',
  },
  {
    id: 'rq2',
    pet_id: '2',
    adoptante_id: 'a2',
    status: 'pendiente',
    pet_name: 'Milo',
    pet_breed: 'Gato Persa',
    adoptante_name: 'Carlos López',
    adoptante_experience:
      'Vivo en un departamento amplio. He tenido gatos antes y conozco sus cuidados. Busco un gato tranquilo que se adapte a la vida en interiores.',
  },
];

export default function RequestsRefugioScreen() {
  const [requests, setRequests] = useState<AdoptionRequest[]>(initialRequests);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'aprobada' } : r))
    );
    Alert.alert('Solicitud aprobada', 'El adoptante será notificado.');
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rechazada' } : r))
    );
    Alert.alert('Solicitud rechazada', 'El adoptante será notificado.');
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const pendingCount = requests.filter((r) => r.status === 'pendiente').length;

  return (
    <Container>
      <Header>
        <HeaderTitle>Solicitudes</HeaderTitle>
        <HeaderCount>
          {pendingCount} solicitudes pendientes
        </HeaderCount>
      </Header>

      {requests.length === 0 ? (
        <EmptyState>
          <Ionicons name="document-text-outline" size={64} color="#d0d5dd" />
          <EmptyText>
            No hay solicitudes de adopción por el momento.
          </EmptyText>
        </EmptyState>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const isExpanded = expandedId === item.id;

            return (
              <Card onPress={() => toggleExpand(item.id)} activeOpacity={0.95}>
                <CardSummary>
                  <AvatarCircle>
                    <Ionicons name="person" size={22} color="#0a7ea4" />
                  </AvatarCircle>
                  <SummaryInfo>
                    <SummaryName>{item.adoptante_name}</SummaryName>
                    <SummaryPet>
                      {item.pet_name} · {item.pet_breed}
                    </SummaryPet>
                  </SummaryInfo>
                  <Badge status={item.status}>
                    <BadgeText status={item.status}>
                      {item.status === 'pendiente'
                        ? 'Pendiente'
                        : item.status === 'aprobada'
                          ? 'Aprobada'
                          : 'Rechazada'}
                    </BadgeText>
                  </Badge>
                </CardSummary>

                {isExpanded && (
                  <ExpandedSection>
                    <Divider />
                    <DetailLabel>Experiencia del solicitante</DetailLabel>
                    <DetailText>{item.adoptante_experience}</DetailText>

                    {item.status === 'pendiente' && (
                      <ActionRow>
                        <AcceptButton onPress={() => handleAccept(item.id)}>
                          <Ionicons name="checkmark-circle" size={18} color="#fff" />
                          <AcceptButtonText>Aceptar</AcceptButtonText>
                        </AcceptButton>
                        <RejectButton onPress={() => handleReject(item.id)}>
                          <Ionicons name="close-circle" size={18} color="#fff" />
                          <RejectButtonText>Rechazar</RejectButtonText>
                        </RejectButton>
                      </ActionRow>
                    )}
                  </ExpandedSection>
                )}
              </Card>
            );
          }}
        />
      )}
    </Container>
  );
}
