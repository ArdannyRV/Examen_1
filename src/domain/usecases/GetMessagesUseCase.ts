import { IChatRepository } from '../repositories/IChatRepository';
import { Message } from '../entities/Message';

export class GetMessagesUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(userId: string, otherUserId: string): Promise<Message[]> {
    return this.chatRepository.getMessages(userId, otherUserId);
  }
}
