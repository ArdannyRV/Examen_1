import { IChatRepository } from '../repositories/IChatRepository';
import { Message } from '../entities/Message';

export class SubscribeMessagesUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  execute(
    userId: string,
    otherUserId: string,
    onNewMessage: (msg: Message) => void
  ): { unsubscribe: () => void } {
    return this.chatRepository.subscribeToMessages(userId, otherUserId, onNewMessage);
  }
}
