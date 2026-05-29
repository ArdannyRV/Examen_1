import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(
    email: string,
    password: string,
    name: string,
    role: 'adoptante' | 'refugio',
    location?: string
  ): Promise<User> {
    return this.authRepository.register(email, password, name, role, location);
  }
}
