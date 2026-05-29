import { useState, useEffect } from 'react';
import { FlatList, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { PetRepositoryImpl } from '@/src/data/repositories/PetRepositoryImpl';
import { GetAllPetsUseCase } from '@/src/domain/usecases/GetAllPetsUseCase';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { LogoutUseCase } from '@/src/domain/usecases/LogoutUseCase';
import type { Pet } from '@/src/domain/entities/Pet';

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

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

const LogoutButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  justify-content: center;
  align-items: center;
`;

const SearchInput = styled.TextInput`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  font-size: 16px;
  color: #fff;
`;

const CategoriesRow = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 20, paddingVertical: 16 },
})``;

const CategoryChip = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: 20px;
  padding-vertical: 10px;
  border-radius: 20px;
  margin-right: 10px;
  background-color: ${(props) => (props.active ? '#0a7ea4' : '#fff')};
  border-width: 1px;
  border-color: ${(props) => (props.active ? '#0a7ea4' : '#d0d5dd')};
`;

const CategoryText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.active ? '#fff' : '#687076')};
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #11181c;
  padding-horizontal: 20px;
  margin-bottom: 12px;
`;

const Card = styled.View`
  background-color: #fff;
  border-radius: 16px;
  margin-horizontal: 20px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 3;
  overflow: hidden;
`;

const CardImage = styled.Image`
  height: 160px;
  width: 100%;
`;

const CardImageFallback = styled.View`
  height: 160px;
  background-color: #e0e7ef;
  justify-content: center;
  align-items: center;
`;

const CardBody = styled.View`
  padding: 14px 16px;
`;

const CardName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #11181c;
`;

const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const CardLabel = styled.Text`
  font-size: 13px;
  color: #687076;
  margin-right: 12px;
`;

const AdoptButton = styled.TouchableOpacity`
  background-color: #0a7ea4;
  border-radius: 10px;
  padding-vertical: 10px;
  align-items: center;
  margin-top: 10px;
`;

const AdoptButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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

const categories = ['Todos', 'Perros', 'Gatos', 'Aves', 'Reptiles'];

export default function LobbyScreen() {
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const repository = new PetRepositoryImpl();
        const useCase = new GetAllPetsUseCase(repository);
        const data = await useCase.execute();
        setPets(data);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar las mascotas');
      } finally {
        setLoading(false);
      }
    };
    loadPets();
  }, []);

  const handleLogout = async () => {
    try {
      const repository = new AuthRepositoryImpl();
      const useCase = new LogoutUseCase(repository);
      await useCase.execute();
      router.replace('/(auth)/login');
    } catch {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  const handleAdopt = (petName: string) => {
    Alert.alert(
      'Solicitud enviada',
      `Has solicitado adoptar a ${petName}. El refugio revisará tu solicitud.`,
      [{ text: 'OK', onPress: () => router.push('/(tabs)/solicitudes') }]
    );
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'Todos' || pet.species === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderRow>
            <HeaderTitle>PetAdopt</HeaderTitle>
          </HeaderRow>
        </Header>
        <Loader>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </Loader>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderRow>
          <HeaderTitle>PetAdopt</HeaderTitle>
          <LogoutButton onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </LogoutButton>
        </HeaderRow>
        <SearchInput
          placeholder="Buscar por raza o nombre..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={search}
          onChangeText={setSearch}
        />
      </Header>

      <CategoriesRow>
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          >
            <CategoryText active={activeCategory === cat}>{cat}</CategoryText>
          </CategoryChip>
        ))}
      </CategoriesRow>

      <SectionTitle>Mascotas disponibles</SectionTitle>

      {filteredPets.length === 0 ? (
        <EmptyState>
          <Ionicons name="paw-outline" size={64} color="#d0d5dd" />
          <EmptyText>No se encontraron mascotas con los filtros actuales.</EmptyText>
        </EmptyState>
      ) : (
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card>
              {item.image_url ? (
                <CardImage source={{ uri: item.image_url }} />
              ) : (
                <CardImageFallback>
                  <Ionicons name="paw" size={48} color="#9ca3af" />
                </CardImageFallback>
              )}
              <CardBody>
                <CardName>{item.name}</CardName>
                <CardRow>
                  <CardLabel>Raza: {item.breed}</CardLabel>
                  <CardLabel>Edad: {item.age}</CardLabel>
                </CardRow>
                {role === 'adoptante' && (
                  <AdoptButton onPress={() => handleAdopt(item.name)}>
                    <AdoptButtonText>Adoptar</AdoptButtonText>
                  </AdoptButton>
                )}
              </CardBody>
            </Card>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Container>
  );
}
