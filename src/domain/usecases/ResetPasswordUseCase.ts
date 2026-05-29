import { IAuthRepository } from '../repositories/IAuthRepository';

export class ResetPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    return this.authRepository.resetPassword(email);
  }
}
