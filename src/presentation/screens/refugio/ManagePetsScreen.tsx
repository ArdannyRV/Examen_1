import { useState, useEffect } from 'react';
import { FlatList, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { PetRepositoryImpl } from '@/src/data/repositories/PetRepositoryImpl';
import { GetPetsByRefugioUseCase } from '@/src/domain/usecases/GetPetsByRefugioUseCase';
import { AddPetUseCase } from '@/src/domain/usecases/AddPetUseCase';
import { UpdatePetUseCase } from '@/src/domain/usecases/UpdatePetUseCase';
import { DeletePetUseCase } from '@/src/domain/usecases/DeletePetUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { MainContainer } from '@/src/presentation/components/ui/Card';
import type { Pet } from '@/src/domain/entities/Pet';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const Content = styled.View`
  flex: 1;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  margin-horizontal: 4px;
  margin-bottom: 10px;
  flex-direction: row;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  elevation: 3;
`;

const CardImage = styled.View`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.border};
  justify-content: center;
  align-items: center;
`;

const CardBody = styled.View`
  flex: 1;
  padding: 10px 12px;
  justify-content: center;
`;

const CardName = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const CardBreed = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const CardActions = styled.View`
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
`;

const ActionButton = styled.TouchableOpacity<{ danger?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
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
  background-color: ${({ theme }) => theme.colors.primary};
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
  color: ${({ theme }) => theme.colors.textLight};
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
  background-color: ${({ theme }) => theme.colors.overlay};
  justify-content: flex-end;
`;

const Sheet = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
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
  color: ${({ theme }) => theme.colors.text};
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
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 6px;
  margin-top: 14px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding-horizontal: 14px;
  padding-vertical: 12px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
`;

const PickerRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const PickerWrapper = styled.View`
  flex: 1;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const ChipRow = styled.View`
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;

const ChipOption = styled.TouchableOpacity<{ active: boolean }>`
  padding-horizontal: 18px;
  padding-vertical: 10px;
  border-radius: 20px;
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : '#f3f4f6')};
`;

const ChipText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ active, theme }) => (active ? '#fff' : theme.colors.textLight)};
`;

const ImagePickerButton = styled.TouchableOpacity`
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  border-style: dashed;
  padding-vertical: 24px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  margin-top: 6px;
`;

const ImagePreview = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  margin-top: 6px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
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

const speciesOptions = ['Perro', 'Gato', 'Ave', 'Reptil', 'Peces', 'Roedores'];
const sizeOptions = ['Pequeño', 'Mediano', 'Grande'];
const yearItems = Array.from({ length: 21 }, (_, i) => i);
const monthItems = Array.from({ length: 12 }, (_, i) => i);

interface FormData {
  name: string;
  species: string;
  breed: string;
  years: number;
  months: number;
  size: 'Pequeño' | 'Mediano' | 'Grande';
  description: string;
}

const emptyForm: FormData = {
  name: '',
  species: 'Perro',
  breed: '',
  years: 0,
  months: 0,
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
      years: 0,
      months: 0,
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
      const ageString = `${form.years} años y ${form.months} meses`;

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

      const ageString = `${form.years} años y ${form.months} meses`;

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
          {pets.length === 0 ? (
            <EmptyState>
              <Ionicons name="paw-outline" size={64} color="#d0d5dd" />
              <EmptyText>Aún no tienes mascotas registradas. Presiona + para agregar una.</EmptyText>
            </EmptyState>
          ) : (
            <FlatList
              data={pets}
              keyExtractor={(item) => item.id}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
              renderItem={({ item }) => (
                <Card>
                  <CardImage>
                    {item.image_url ? (
                      <Image source={{ uri: item.image_url }} style={{ width: 80, height: 80 }} />
                    ) : (
                      <Ionicons name="paw" size={28} color="#9ca3af" />
                    )}
                  </CardImage>
                  <CardBody>
                    <CardName>{item.name}</CardName>
                    <CardBreed>
                      {item.species} · {item.age} · {item.size}
                    </CardBreed>
                    <CardActions>
                      <ActionButton onPress={() => openEdit(item)}>
                        <Ionicons name="pencil" size={14} color="#10B981" />
                      </ActionButton>
                      <ActionButton danger onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={14} color="#dc2626" />
                      </ActionButton>
                    </CardActions>
                  </CardBody>
                </Card>
              )}
            />
          )}
        </Content>
      </MainContainer>

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
                <ChipRow>
                  {speciesOptions.map((s) => (
                    <ChipOption
                      key={s}
                      active={form.species === s}
                      onPress={() => setForm((prev) => ({ ...prev, species: s }))}
                    >
                      <ChipText active={form.species === s}>{s}</ChipText>
                    </ChipOption>
                  ))}
                </ChipRow>

                <FieldLabel>Raza *</FieldLabel>
                <Input
                  placeholder="Raza"
                  value={form.breed}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, breed: text }))}
                />

                <FieldLabel>Edad *</FieldLabel>
                <PickerRow>
                  <PickerWrapper>
                    <Picker
                      selectedValue={form.years}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, years: value }))}
                    >
                      {yearItems.map((y) => (
                        <Picker.Item key={y} label={`${y} año${y !== 1 ? 's' : ''}`} value={y} />
                      ))}
                    </Picker>
                  </PickerWrapper>
                  <PickerWrapper>
                    <Picker
                      selectedValue={form.months}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, months: value }))}
                    >
                      {monthItems.map((m) => (
                        <Picker.Item key={m} label={`${m} mes${m !== 1 ? 'es' : ''}`} value={m} />
                      ))}
                    </Picker>
                  </PickerWrapper>
                </PickerRow>

                <FieldLabel>Tamaño</FieldLabel>
                <ChipRow>
                  {sizeOptions.map((s) => (
                    <ChipOption
                      key={s}
                      active={form.size === s}
                      onPress={() => setForm((prev) => ({ ...prev, size: s as FormData['size'] }))}
                    >
                      <ChipText active={form.size === s}>{s}</ChipText>
                    </ChipOption>
                  ))}
                </ChipRow>

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
                  <ChipText active={false} style={{ marginTop: 8 }}>
                    {imageUri ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  </ChipText>
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
