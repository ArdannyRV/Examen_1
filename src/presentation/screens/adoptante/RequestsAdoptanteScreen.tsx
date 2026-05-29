import { useState, useCallback } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { RequestRepositoryImpl } from '@/src/data/repositories/RequestRepositoryImpl';
import { GetRequestsUseCase } from '@/src/domain/usecases/GetRequestsUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import LoadingGato from '@/src/presentation/components/ui/LoadingGato';
import EmptyStateGato from '@/src/presentation/components/ui/EmptyStateGato';
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

const FilterRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding-vertical: 8px;
  border-radius: 20px;
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : 'rgba(255,255,255,0.85)')};
  border-width: 1px;
  border-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.border)};
  align-items: center;
`;

const FilterChipText = styled.Text<{ active: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ active, theme }) => (active ? '#fff' : theme.colors.textLight)};
`;

const statusFilters = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'aprobada', label: 'Aprobadas' },
  { key: 'rechazada', label: 'Rechazadas' },
] as const;

export default function RequestsAdoptanteScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas');

  const filteredRequests = requests.filter(req =>
    statusFilter === 'todas' || req.status.toLowerCase() === statusFilter
  );

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
        <LoadingGato />
      </Container>
    );
  }

  return (
    <Container>
      <AnimatedBackground />
      <MainContainer style={{ paddingHorizontal: 16 }}>
        <Content>
          <FlatList
            data={filteredRequests}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
            ListHeaderComponent={
              <FilterRow>
                {statusFilters.map((f) => (
                  <FilterChip
                    key={f.key}
                    active={statusFilter === f.key}
                    onPress={() => setStatusFilter(f.key)}
                  >
                    <FilterChipText active={statusFilter === f.key}>{f.label}</FilterChipText>
                  </FilterChip>
                ))}
              </FilterRow>
            }
            ListEmptyComponent={<EmptyStateGato message="No has realizado solicitudes de adopción aún." />}
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
        </Content>
      </MainContainer>
    </Container>
  );
}
