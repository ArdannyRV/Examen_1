import { IPetRepository } from '../../domain/repositories/IPetRepository';
import { Pet } from '../../domain/entities/Pet';
import { supabase } from '../sources/supabaseClient';
import { decode } from 'base64-arraybuffer';

const mapRow = (item: any): Pet => ({
  id: item.id,
  refugio_id: item.refugio_id,
  name: item.name,
  species: item.species,
  breed: item.breed,
  age: item.age,
  size: item.size,
  description: item.description ?? '',
  image_url: item.image_url,
});

export class PetRepositoryImpl implements IPetRepository {
  async getAllPets(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*, adoption_requests(status)');
    if (error) throw new Error(error.message);
    const availablePets = (data ?? []).filter((pet) => {
      if (!pet.adoption_requests || pet.adoption_requests.length === 0) return true;
      return !pet.adoption_requests.some((req: any) => req.status === 'aprobada');
    });
    return availablePets.map(mapRow);
  }

  async getPetsByRefugio(refugioId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('refugio_id', refugioId);
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
  }

  async createPet(pet: Omit<Pet, 'id' | 'created_at'>, imageBase64: string): Promise<void> {
    let imageUrl: string | undefined;

    if (imageBase64) {
      const fileName = `${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('pets_images')
        .upload(fileName, decode(imageBase64), { contentType: 'image/jpeg' });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('pets_images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData?.publicUrl;
    }

    const { error } = await supabase.from('pets').insert({
      refugio_id: pet.refugio_id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      size: pet.size,
      description: pet.description,
      image_url: imageUrl,
    });

    if (error) throw new Error(error.message);
  }

  async updatePet(id: string, pet: Partial<Pet>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update(pet)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return mapRow(data);
  }

  async deletePet(id: string): Promise<void> {
    const { error } = await supabase.from('pets').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
