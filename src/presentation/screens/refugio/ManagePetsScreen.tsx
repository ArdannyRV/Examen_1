import { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
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
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

const PetCount = styled.Text`
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
`;

const CardImage = styled.View`
  width: 100px;
  background-color: #e0e7ef;
  justify-content: center;
  align-items: center;
`;

const CardBody = styled.View`
  flex: 1;
  padding: 14px;
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

const CardActions = styled.View`
  flex-direction: row;
  gap: 4px;
  margin-top: 10px;
`;

const ActionButton = styled.TouchableOpacity<{ danger?: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: ${(props) => (props.danger ? '#fef2f2' : '#f3f4f6')};
  justify-content: center;
  align-items: center;
`;

const FAB = styled.TouchableOpacity`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 58px;
  height: 58px;
  border-radius: 29px;
  background-color: #0a7ea4;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 6;
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

const mockPets: Pet[] = [
  {
    id: '1',
    refugio_id: 'r1',
    name: 'Luna',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: '2 años',
    size: 'grande',
    description: 'Luna es una perrita muy cariñosa y juguetona. Le encanta correr y pasar tiempo con personas.',
  },
  {
    id: '2',
    refugio_id: 'r1',
    name: 'Milo',
    species: 'Gato',
    breed: 'Persa',
    age: '3 años',
    size: 'mediano',
    description: 'Milo es un gato tranquilo y muy independiente. Ideal para departamentos.',
  },
];

const speciesEmoji: Record<string, string> = {
  Perro: '🐕',
  Gato: '🐈',
  Ave: '🐦',
  Reptil: '🦎',
};

export default function ManagePetsScreen() {
  const [pets, setPets] = useState<Pet[]>(mockPets);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar mascota', '¿Estás seguro de eliminar esta mascota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setPets((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  };

  const handleEdit = (pet: Pet) => {
    Alert.alert('Editar', `Editar información de ${pet.name}`);
  };

  const handleAdd = () => {
    Alert.alert('Agregar mascota', 'Formulario de nueva mascota (próximamente)');
  };

  return (
    <Container>
      <Header>
        <HeaderRow>
          <View>
            <HeaderTitle>Mis Mascotas</HeaderTitle>
            <PetCount>{pets.length} mascotas registradas</PetCount>
          </View>
        </HeaderRow>
      </Header>

      {pets.length === 0 ? (
        <EmptyState>
          <Ionicons name="paw-outline" size={64} color="#d0d5dd" />
          <EmptyText>Aún no tienes mascotas registradas. Presiona + para agregar una.</EmptyText>
        </EmptyState>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Card>
              <CardImage>
                <Ionicons name="paw" size={32} color="#9ca3af" />
              </CardImage>
              <CardBody>
                <CardName>{item.name}</CardName>
                <CardBreed>
                  {item.breed} · {item.age} · {item.size}
                </CardBreed>
                <CardActions>
                  <ActionButton onPress={() => handleEdit(item)}>
                    <Ionicons name="pencil" size={16} color="#0a7ea4" />
                  </ActionButton>
                  <ActionButton danger onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                  </ActionButton>
                </CardActions>
              </CardBody>
            </Card>
          )}
        />
      )}

      <FAB onPress={handleAdd}>
        <Ionicons name="add" size={28} color="#fff" />
      </FAB>
    </Container>
  );
}
