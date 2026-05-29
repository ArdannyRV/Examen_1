import { useState, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { useAuth } from '@/src/presentation/context/AuthContext';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import LoadingGato from '@/src/presentation/components/ui/LoadingGato';
import EmptyStateGato from '@/src/presentation/components/ui/EmptyStateGato';
import Input from '@/src/presentation/components/ui/Input';
import { MainContainer } from '@/src/presentation/components/ui/Card';
import { UserRepositoryImpl } from '@/src/data/repositories/UserRepositoryImpl';
import { GetContactsUseCase } from '@/src/domain/usecases/GetContactsUseCase';
import type { User } from '@/src/domain/entities/User';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const ContactCard = styled.TouchableOpacity`
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

const RoleBadge = styled.View`
  align-self: flex-start;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.colors.primary}20;
  padding-horizontal: 10px;
  padding-vertical: 2px;
  border-radius: 8px;
`;

const RoleText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: capitalize;
`;

const ChatIcon = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

export default function ChatsScreen() {
  const { role, user } = useAuth();
  const [contacts, setContacts] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!role) return;
        setLoading(true);
        try {
          const repository = new UserRepositoryImpl();
          const useCase = new GetContactsUseCase(repository);
          const data = await useCase.execute(role);
          setContacts(data);
        } catch {
          setContacts([]);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [role])
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
        <View style={{ paddingBottom: 16 }}>
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 120, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyStateGato
              message={
                role === 'adoptante'
                  ? 'No hay refugios disponibles para contactar aún.'
                  : 'No hay adoptantes disponibles para contactar aún.'
              }
            />
          }
          renderItem={({ item }) => (
            <ContactCard
              activeOpacity={0.95}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <Avatar>
                <Ionicons name="person" size={24} color="#10B981" />
              </Avatar>
              <Info>
                <ContactName>{item.name}</ContactName>
                <RoleBadge>
                  <RoleText>{item.role}</RoleText>
                </RoleBadge>
              </Info>
              <ChatIcon>
                <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
              </ChatIcon>
            </ContactCard>
          )}
        />
      </MainContainer>
    </Container>
  );
}
