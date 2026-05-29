import { IUserRepository } from '../repositories/IUserRepository';

export class SavePushTokenUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, token: string): Promise<void> {
    return this.userRepository.savePushToken(userId, token);
  }
}
