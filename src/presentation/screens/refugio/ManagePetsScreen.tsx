import { useState, useEffect } from 'react';
import { FlatList, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { PetRepositoryImpl } from '@/src/data/repositories/PetRepositoryImpl';
import { GetPetsByRefugioUseCase } from '@/src/domain/usecases/GetPetsByRefugioUseCase';
import { AddPetUseCase } from '@/src/domain/usecases/AddPetUseCase';
import { UpdatePetUseCase } from '@/src/domain/usecases/UpdatePetUseCase';
import { DeletePetUseCase } from '@/src/domain/usecases/DeletePetUseCase';
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

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

const Sheet = styled.View`
  background-color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  max-height: 90%;
`;

const SheetHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SheetTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #11181c;
`;

const CloseButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #f3f4f6;
  justify-content: center;
  align-items: center;
`;

const FieldLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #687076;
  margin-bottom: 6px;
  margin-top: 14px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #d0d5dd;
  border-radius: 10px;
  padding-horizontal: 14px;
  padding-vertical: 12px;
  font-size: 15px;
  color: #11181c;
  background-color: #fafafa;
`;

const AgeRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const AgeInput = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-color: #d0d5dd;
  border-radius: 10px;
  padding-horizontal: 14px;
  padding-vertical: 12px;
  font-size: 15px;
  color: #11181c;
  background-color: #fafafa;
`;

const AgeLabel = styled.Text`
  font-size: 13px;
  color: #687076;
  margin-top: 8px;
`;

const Picker = styled.View`
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;

const PickerOption = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: 18px;
  padding-vertical: 10px;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? '#0a7ea4' : '#f3f4f6')};
`;

const PickerText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.active ? '#fff' : '#687076')};
`;

const ImagePickerButton = styled.TouchableOpacity`
  border-width: 1.5px;
  border-color: #d0d5dd;
  border-radius: 12px;
  border-style: dashed;
  padding-vertical: 24px;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  margin-top: 6px;
`;

const ImagePreview = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  margin-top: 6px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #0a7ea4;
  border-radius: 12px;
  padding-vertical: 14px;
  align-items: center;
  margin-top: 24px;
`;

const SubmitButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;

const speciesOptions = ['Perro', 'Gato', 'Ave', 'Reptil'];
const sizeOptions = ['Pequeño', 'Mediano', 'Grande'];

interface FormData {
  name: string;
  species: string;
  breed: string;
  years: string;
  months: string;
  size: 'Pequeño' | 'Mediano' | 'Grande';
  description: string;
}

const emptyForm: FormData = {
  name: '',
  species: 'Perro',
  breed: '',
  years: '',
  months: '',
  size: 'Mediano',
  description: '',
};

export default function ManagePetsScreen() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const loadPets = async () => {
    if (!user) return;
    try {
      const repository = new PetRepositoryImpl();
      const useCase = new GetPetsByRefugioUseCase(repository);
      const data = await useCase.execute(user.id);
      setPets(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, [user]);

  const openAdd = () => {
    setEditingPet(null);
    setForm(emptyForm);
    setImageUri(null);
    setImageBase64(null);
    setModalVisible(true);
  };

  const openEdit = (pet: Pet) => {
    setEditingPet(pet);
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      years: '',
      months: '',
      size: pet.size,
      description: pet.description,
    });
    setImageUri(null);
    setImageBase64(null);
    setModalVisible(true);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 ?? null);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.breed.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y raza son obligatorios');
      return;
    }
    if (!user) return;
    if (editingPet) {
      const ageString = form.years || form.months
        ? `${form.years || '0'} años y ${form.months || '0'} meses`
        : editingPet.age;

      setSaving(true);
      try {
        const repository = new PetRepositoryImpl();
        const useCase = new UpdatePetUseCase(repository);
        const updated = await useCase.execute(editingPet.id, {
          name: form.name.trim(),
          species: form.species,
          breed: form.breed.trim(),
          age: ageString,
          size: form.size,
          description: form.description.trim(),
        });
        setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setModalVisible(false);
      } catch {
        Alert.alert('Error', 'No se pudo actualizar la mascota');
      } finally {
        setSaving(false);
      }
    } else {
      if (!imageBase64) {
        Alert.alert('Imagen requerida', 'Debes seleccionar una imagen para la mascota');
        return;
      }

      const ageString = `${form.years || '0'} años y ${form.months || '0'} meses`;

      setSaving(true);
      try {
        const repository = new PetRepositoryImpl();
        const useCase = new AddPetUseCase(repository);
        await useCase.execute(
          {
            refugio_id: user.id,
            name: form.name.trim(),
            species: form.species,
            breed: form.breed.trim(),
            age: ageString,
            size: form.size,
            description: form.description.trim(),
          },
          imageBase64,
        );
        setModalVisible(false);
        setLoading(true);
        await loadPets();
      } catch {
        Alert.alert('Error', 'No se pudo guardar la mascota');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar mascota', '¿Estás seguro de eliminar esta mascota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const repository = new PetRepositoryImpl();
            const useCase = new DeletePetUseCase(repository);
            await useCase.execute(id);
            setPets((prev) => prev.filter((p) => p.id !== id));
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la mascota');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderRow>
            <HeaderTitle>Mis Mascotas</HeaderTitle>
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
          <HeaderTitle>Mis Mascotas</HeaderTitle>
        </HeaderRow>
        <PetCount>{pets.length} mascotas registradas</PetCount>
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
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={{ width: 100, height: '100%' }} />
                ) : (
                  <Ionicons name="paw" size={32} color="#9ca3af" />
                )}
              </CardImage>
              <CardBody>
                <CardName>{item.name}</CardName>
                <CardBreed>
                  {item.breed} · {item.age} · {item.size}
                </CardBreed>
                <CardActions>
                  <ActionButton onPress={() => openEdit(item)}>
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

      <FAB onPress={openAdd}>
        <Ionicons name="add" size={28} color="#fff" />
      </FAB>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Overlay>
            <Sheet>
              <SheetHeader>
                <SheetTitle>{editingPet ? 'Editar mascota' : 'Nueva mascota'}</SheetTitle>
                <CloseButton onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={20} color="#687076" />
                </CloseButton>
              </SheetHeader>

              <ScrollView showsVerticalScrollIndicator={false}>
                <FieldLabel>Nombre *</FieldLabel>
                <Input
                  placeholder="Nombre de la mascota"
                  value={form.name}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                />

                <FieldLabel>Especie</FieldLabel>
                <Picker>
                  {speciesOptions.map((s) => (
                    <PickerOption
                      key={s}
                      active={form.species === s}
                      onPress={() => setForm((prev) => ({ ...prev, species: s }))}
                    >
                      <PickerText active={form.species === s}>{s}</PickerText>
                    </PickerOption>
                  ))}
                </Picker>

                <FieldLabel>Raza *</FieldLabel>
                <Input
                  placeholder="Raza"
                  value={form.breed}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, breed: text }))}
                />

                <FieldLabel>Edad *</FieldLabel>
                <AgeRow>
                  <AgeInput
                    placeholder="Años"
                    keyboardType="numeric"
                    value={form.years}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, years: text }))}
                  />
                  <AgeLabel>Años</AgeLabel>
                  <AgeInput
                    placeholder="Meses"
                    keyboardType="numeric"
                    value={form.months}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, months: text }))}
                  />
                  <AgeLabel>Meses</AgeLabel>
                </AgeRow>

                <FieldLabel>Tamaño</FieldLabel>
                <Picker>
                  {sizeOptions.map((s) => (
                    <PickerOption
                      key={s}
                      active={form.size === s}
                      onPress={() => setForm((prev) => ({ ...prev, size: s as FormData['size'] }))}
                    >
                      <PickerText active={form.size === s}>{s}</PickerText>
                    </PickerOption>
                  ))}
                </Picker>

                <FieldLabel>Descripción</FieldLabel>
                <Input
                  placeholder="Describe a la mascota"
                  multiline
                  numberOfLines={3}
                  value={form.description}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
                  style={{ minHeight: 80, textAlignVertical: 'top' }}
                />

                <FieldLabel>Imagen</FieldLabel>
                {imageUri ? (
                  <ImagePreview source={{ uri: imageUri }} />
                ) : null}
                <ImagePickerButton onPress={handlePickImage}>
                  <Ionicons name="camera-outline" size={28} color="#687076" />
                  <PickerText active={false} style={{ marginTop: 8 }}>
                    {imageUri ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  </PickerText>
                </ImagePickerButton>

                <SubmitButton onPress={handleSave} disabled={saving}>
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <SubmitButtonText>
                      {editingPet ? 'Actualizar mascota' : 'Agregar mascota'}
                    </SubmitButtonText>
                  )}
                </SubmitButton>
              </ScrollView>
            </Sheet>
          </Overlay>
        </KeyboardAvoidingView>
      </Modal>
    </Container>
  );
}
