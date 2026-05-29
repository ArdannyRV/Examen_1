import { Pet } from '../entities/Pet';
import { IPetRepository } from '../repositories/IPetRepository';

export class UpdatePetUseCase {
  constructor(private repository: IPetRepository) {}

  async execute(id: string, pet: Partial<Pet>): Promise<Pet> {
    return this.repository.updatePet(id, pet);
  }
}
