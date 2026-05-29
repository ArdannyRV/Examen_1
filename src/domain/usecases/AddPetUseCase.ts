import { Pet } from '../entities/Pet';
import { IPetRepository } from '../repositories/IPetRepository';

export class AddPetUseCase {
  constructor(private repository: IPetRepository) {}

  async execute(pet: Omit<Pet, 'id' | 'created_at'>, imageBase64: string): Promise<void> {
    return this.repository.createPet(pet, imageBase64);
  }
}
