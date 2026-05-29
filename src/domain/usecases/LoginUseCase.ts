import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    return this.authRepository.login(email, password);
  }
}
