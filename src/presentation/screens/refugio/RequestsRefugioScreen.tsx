import { useState, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { RequestRepositoryImpl } from '@/src/data/repositories/RequestRepositoryImpl';
import { GetRequestsUseCase } from '@/src/domain/usecases/GetRequestsUseCase';
import { UpdateRequestStatusUseCase } from '@/src/domain/usecases/UpdateRequestStatusUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { MainContainer } from '@/src/presentation/components/ui/Card';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const Content = styled.View`
  flex: 1;
`;

const Card = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  margin-horizontal: 4px;
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
  color: ${({ theme }) => theme.colors.text};
`;

const SummaryPet = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
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
  background-color: ${({ theme }) => theme.colors.border};
  margin-bottom: 14px;
`;

const DetailLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const DetailText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
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
  background-color: ${({ theme }) => theme.colors.primaryDark};
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
  background-color: ${({ theme }) => theme.colors.danger};
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
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  margin-top: 12px;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function RequestsRefugioScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      setLoading(true);
      const load = async () => {
        try {
          const repository = new RequestRepositoryImpl();
          const useCase = new GetRequestsUseCase(repository);
          const data = await useCase.execute(user.id, 'refugio');
          setRequests(data);
        } catch {
          Alert.alert('Error', 'No se pudieron cargar las solicitudes');
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [user])
  );

  const handleAccept = async (id: string) => {
    try {
      const repository = new RequestRepositoryImpl();
      const useCase = new UpdateRequestStatusUseCase(repository);
      await useCase.execute(id, 'aprobada');
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'aprobada' } : r))
      );
      Alert.alert('Solicitud aprobada', 'El adoptante será notificado.');
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la solicitud');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const repository = new RequestRepositoryImpl();
      const useCase = new UpdateRequestStatusUseCase(repository);
      await useCase.execute(id, 'rechazada');
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'rechazada' } : r))
      );
      Alert.alert('Solicitud rechazada', 'El adoptante será notificado.');
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la solicitud');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const pendingCount = requests.filter((r: any) => r.status === 'pendiente').length;

  if (loading) {
    return (
      <Container>
        <AnimatedBackground />
        <Loader>
          <ActivityIndicator size="large" color="#10B981" />
        </Loader>
      </Container>
    );
  }

  return (
    <Container>
      <AnimatedBackground />
      <MainContainer style={{ paddingHorizontal: 16 }}>
        <Content>
          {requests.length === 0 ? (
            <EmptyState>
              <Ionicons name="document-text-outline" size={64} color="#d0d5dd" />
              <EmptyText>No hay solicitudes de adopción por el momento.</EmptyText>
            </EmptyState>
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 120 }}
              renderItem={({ item }) => {
                const isExpanded = expandedId === item.id;
                const adoptanteName = item.adoptante?.name ?? 'Desconocido';
                const petName = item.pet?.name ?? 'Mascota';
                const petBreed = item.pet?.breed ?? '';

                return (
                  <Card onPress={() => toggleExpand(item.id)} activeOpacity={0.95}>
                    <CardSummary>
                      <AvatarCircle>
                        <Ionicons name="person" size={22} color="#10B981" />
                      </AvatarCircle>
                      <SummaryInfo>
                        <SummaryName>{adoptanteName}</SummaryName>
                        <SummaryPet>{petName} · {petBreed}</SummaryPet>
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
                        <DetailText>{item.adoptante?.experience ?? 'Sin experiencia registrada'}</DetailText>

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
        </Content>
      </MainContainer>
    </Container>
  );
}
