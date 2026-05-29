import { IRequestRepository } from '../repositories/IRequestRepository';

export class GetRequestsUseCase {
  constructor(private readonly requestRepository: IRequestRepository) {}

  async execute(userId: string, role: string): Promise<any[]> {
    return this.requestRepository.getRequests(userId, role);
  }
}
