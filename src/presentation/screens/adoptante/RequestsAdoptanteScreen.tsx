import { useState, useCallback } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { RequestRepositoryImpl } from '@/src/data/repositories/RequestRepositoryImpl';
import { GetRequestsUseCase } from '@/src/domain/usecases/GetRequestsUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { MainContainer } from '@/src/presentation/components/ui/Card';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const Content = styled.View`
  flex: 1;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  margin-horizontal: 4px;
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
  background-color: ${({ theme }) => theme.colors.border};
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
  color: ${({ theme }) => theme.colors.text};
`;

const CardBreed = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
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
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  margin-top: 12px;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function RequestsAdoptanteScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!user) return;
        setLoading(true);
        try {
          const repository = new RequestRepositoryImpl();
          const useCase = new GetRequestsUseCase(repository);
          const data = await useCase.execute(user.id, 'adoptante');
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
              <EmptyText>No has realizado solicitudes de adopción aún.</EmptyText>
            </EmptyState>
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 120 }}
              renderItem={({ item }) => (
                <Card>
                  <CardAvatar>
                    <Ionicons name="paw" size={28} color="#9ca3af" />
                  </CardAvatar>
                  <CardBody>
                    <CardName>{item.pet?.name ?? 'Mascota'}</CardName>
                    <CardBreed>{item.pet?.breed ?? ''}</CardBreed>
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
        </Content>
      </MainContainer>
    </Container>
  );
}
