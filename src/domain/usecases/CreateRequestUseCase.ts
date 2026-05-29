import { IRequestRepository } from '../repositories/IRequestRepository';

export class CreateRequestUseCase {
  constructor(private repository: IRequestRepository) {}

  async execute(petId: string, adoptanteId: string): Promise<void> {
    return this.repository.createRequest(petId, adoptanteId);
  }
}
