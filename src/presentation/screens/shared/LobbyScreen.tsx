import { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AuthRepositoryImpl } from '@/src/data/repositories/AuthRepositoryImpl';
import { LogoutUseCase } from '@/src/domain/usecases/LogoutUseCase';

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

const CardImage = styled.View`
  height: 160px;
  background-color: #e0e7ef;
`;

const CardImageText = styled.Text`
  font-size: 40px;
  text-align: center;
  line-height: 160px;
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

const categories = ['Todas', 'Perros', 'Gatos', 'Aves', 'Reptiles'];

const pets = [
  {
    id: '1',
    name: 'Luna',
    breed: 'Golden Retriever',
    age: '2 años',
    emoji: '🐕',
    category: 'Perros',
  },
  {
    id: '2',
    name: 'Milo',
    breed: 'Gato Persa',
    age: '3 años',
    emoji: '🐈',
    category: 'Gatos',
  },
  {
    id: '3',
    name: 'Paco',
    breed: 'Periquito Australiano',
    age: '1 año',
    emoji: '🐦',
    category: 'Aves',
  },
];

export default function LobbyScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

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

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'Todas' || pet.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <CardImage>
              <CardImageText>{item.emoji}</CardImageText>
            </CardImage>
            <CardBody>
              <CardName>{item.name}</CardName>
              <CardRow>
                <CardLabel>Raza: {item.breed}</CardLabel>
                <CardLabel>Edad: {item.age}</CardLabel>
              </CardRow>
            </CardBody>
          </Card>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
