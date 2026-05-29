import { Message } from '../entities/Message';

export interface IChatRepository {
  getMessages(userId: string, otherUserId: string): Promise<Message[]>;
  sendMessage(senderId: string, receiverId: string, content: string): Promise<void>;
  subscribeToMessages(
    userId: string,
    otherUserId: string,
    onNewMessage: (msg: Message) => void
  ): { unsubscribe: () => void };
}
