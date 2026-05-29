import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

export class GetContactsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(currentRole: string): Promise<User[]> {
    return this.userRepository.getContacts(currentRole);
  }
}
