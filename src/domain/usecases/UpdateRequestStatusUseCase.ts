import { IRequestRepository } from '../repositories/IRequestRepository';

export class UpdateRequestStatusUseCase {
  constructor(private repository: IRequestRepository) {}

  async execute(requestId: string, newStatus: 'aprobada' | 'rechazada'): Promise<void> {
    return this.repository.updateRequestStatus(requestId, newStatus);
  }
}
