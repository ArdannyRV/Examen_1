import { useState, useEffect } from 'react';
import { FlatList, Alert, ActivityIndicator, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { PetRepositoryImpl } from '@/src/data/repositories/PetRepositoryImpl';
import { GetAllPetsUseCase } from '@/src/domain/usecases/GetAllPetsUseCase';
import { RequestRepositoryImpl } from '@/src/data/repositories/RequestRepositoryImpl';
import { CreateRequestUseCase } from '@/src/domain/usecases/CreateRequestUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { MainContainer } from '@/src/presentation/components/ui/Card';
import type { Pet } from '@/src/domain/entities/Pet';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 56) / 2;

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const SearchInput = styled.TextInput`
  background-color: #fff;
  border-radius: 12px;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  font-size: 16px;
  color: #1F2937;
  border-width: 1px;
  border-color: rgba(16, 185, 129, 0.2);
  margin-bottom: 24px;
`;

const FilterRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const CategoryChip = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  max-width: ${(screenWidth - 72) / 4}px;
  padding-vertical: 6px;
  border-radius: 20px;
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : 'rgba(255,255,255,0.85)')};
  border-width: 1px;
  border-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.border)};
  align-items: center;
`;

const CategoryText = styled.Text<{ active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ active, theme }) => (active ? '#fff' : theme.colors.textLight)};
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const PetCard = styled.View`
  width: ${cardWidth}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  margin-bottom: 16px;
  margin-horizontal: 6px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 3;
  overflow: hidden;
`;

const CardImage = styled.Image`
  height: 120px;
  width: 100%;
`;

const CardImageFallback = styled.View`
  height: 120px;
  background-color: ${({ theme }) => theme.colors.border};
  justify-content: center;
  align-items: center;
`;

const CardBody = styled.View`
  padding: 10px 12px;
`;

const CardName = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const CardLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-right: 8px;
`;

const AdoptButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding-vertical: 8px;
  align-items: center;
  margin-top: 8px;
`;

const AdoptButtonText = styled.Text`
  color: #fff;
  font-size: 13px;
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
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  margin-top: 12px;
`;

const categories = ['Todos', 'Perros', 'Gatos', 'Aves', 'Reptiles', 'Peces', 'Roedores'];

const speciesMap: Record<string, string> = {
  Todos: '',
  Perros: 'Perro',
  Gatos: 'Gato',
  Aves: 'Ave',
  Reptiles: 'Reptil',
  Peces: 'Peces',
  Roedores: 'Roedores',
};

export default function LobbyScreen() {
  const { user, role } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [adoptingId, setAdoptingId] = useState<string | null>(null);

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

  const handleAdopt = (pet: Pet) => {
    Alert.alert(
      'Confirmar solicitud',
      `¿Deseas enviar una solicitud de adopción para ${pet.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            if (!user) return;
            setAdoptingId(pet.id);
            try {
              const repository = new RequestRepositoryImpl();
              const useCase = new CreateRequestUseCase(repository);
              await useCase.execute(pet.id, user.id);
              Alert.alert(
                'Solicitud enviada',
                `Has solicitado adoptar a ${pet.name}. El refugio revisará tu solicitud.`,
                [{ text: 'OK', onPress: () => router.push('/(tabs)/solicitudes') }]
              );
            } catch {
              Alert.alert('Error', 'No se pudo enviar la solicitud. Intenta de nuevo.');
            } finally {
              setAdoptingId(null);
            }
          },
        },
      ]
    );
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.species.toLowerCase().includes(search.toLowerCase());
    const selectedSpecies = speciesMap[activeCategory];
    const matchesCategory =
      activeCategory === 'Todos' || pet.species === selectedSpecies;
    return matchesSearch && matchesCategory;
  });

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

  const firstRow = categories.slice(0, 4);
  const secondRow = categories.slice(4);

  return (
    <Container>
      <AnimatedBackground />
      <MainContainer>
        <SearchInput
          placeholder="Buscar por especie o nombre..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        <FilterRow>
          {firstRow.map((cat) => (
            <CategoryChip
              key={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            >
              <CategoryText active={activeCategory === cat}>{cat}</CategoryText>
            </CategoryChip>
          ))}
        </FilterRow>
        <FilterRow>
          {secondRow.map((cat) => (
            <CategoryChip
              key={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            >
              <CategoryText active={activeCategory === cat}>{cat}</CategoryText>
            </CategoryChip>
          ))}
        </FilterRow>

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
            numColumns={2}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 120, paddingTop: 16 }}
            renderItem={({ item }) => (
              <PetCard>
                {item.image_url ? (
                  <CardImage source={{ uri: item.image_url }} />
                ) : (
                  <CardImageFallback>
                    <Ionicons name="paw" size={32} color="#9ca3af" />
                  </CardImageFallback>
                )}
                <CardBody>
                  <CardName numberOfLines={1}>{item.name}</CardName>
                  <CardRow>
                    <CardLabel>Especie: {item.species}</CardLabel>
                  </CardRow>
                  <CardRow>
                    <CardLabel>Edad: {item.age}</CardLabel>
                  </CardRow>
                  {role === 'adoptante' && (
                    <AdoptButton
                      onPress={() => handleAdopt(item)}
                      disabled={adoptingId === item.id}
                    >
                      {adoptingId === item.id ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <AdoptButtonText>Adoptar</AdoptButtonText>
                      )}
                    </AdoptButton>
                  )}
                </CardBody>
              </PetCard>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </MainContainer>
    </Container>
  );
}
