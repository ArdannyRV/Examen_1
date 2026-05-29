import { Pet } from '../entities/Pet';

export interface IPetRepository {
  getAllPets(): Promise<Pet[]>;
  getPetsByRefugio(refugioId: string): Promise<Pet[]>;
  createPet(pet: Omit<Pet, 'id' | 'created_at'>, imageBase64: string): Promise<void>;
  updatePet(id: string, pet: Partial<Pet>): Promise<Pet>;
  deletePet(id: string): Promise<void>;
}
