import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { Message } from '../../domain/entities/Message';
import { supabase } from '../sources/supabaseClient';

export class ChatRepositoryImpl implements IChatRepository {
  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as Message[];
  }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .insert({ sender_id: senderId, receiver_id: receiverId, content });

    if (error) throw new Error(error.message);
  }

  subscribeToMessages(
    userId: string,
    otherUserId: string,
    onNewMessage: (msg: Message) => void
  ): { unsubscribe: () => void } {
    const channel = supabase
      .channel(`chat_${userId}_${otherUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === userId && newMsg.receiver_id === otherUserId) ||
            (newMsg.sender_id === otherUserId && newMsg.receiver_id === userId)
          ) {
            onNewMessage(newMsg);
          }
        }
      )
      .subscribe();

    return { unsubscribe: () => supabase.removeChannel(channel) };
  }
}
