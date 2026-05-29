import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';

export class GetRefugiosUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.getRefugios();
  }
}
