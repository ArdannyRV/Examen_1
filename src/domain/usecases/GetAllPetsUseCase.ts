import { IPetRepository } from '../repositories/IPetRepository';
import { Pet } from '../entities/Pet';

export class GetAllPetsUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(): Promise<Pet[]> {
    return this.petRepository.getAllPets();
  }
}
