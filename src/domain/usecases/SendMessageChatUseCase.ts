import { IChatRepository } from '../repositories/IChatRepository';

export class SendMessageChatUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(senderId: string, receiverId: string, content: string): Promise<void> {
    return this.chatRepository.sendMessage(senderId, receiverId, content);
  }
}
