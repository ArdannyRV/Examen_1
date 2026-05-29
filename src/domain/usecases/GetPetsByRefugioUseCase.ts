import { Pet } from '../entities/Pet';
import { IPetRepository } from '../repositories/IPetRepository';

export class GetPetsByRefugioUseCase {
  constructor(private repository: IPetRepository) {}

  async execute(refugioId: string): Promise<Pet[]> {
    return this.repository.getPetsByRefugio(refugioId);
  }
}
