import { IPetRepository } from '../repositories/IPetRepository';

export class DeletePetUseCase {
  constructor(private repository: IPetRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deletePet(id);
  }
}
