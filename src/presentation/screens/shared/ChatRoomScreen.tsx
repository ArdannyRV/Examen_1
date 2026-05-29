import { useState, useEffect, useRef } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { ChatRepositoryImpl } from '@/src/data/repositories/ChatRepositoryImpl';
import { GetMessagesUseCase } from '@/src/domain/usecases/GetMessagesUseCase';
import { SendMessageChatUseCase } from '@/src/domain/usecases/SendMessageChatUseCase';
import { SubscribeMessagesUseCase } from '@/src/domain/usecases/SubscribeMessagesUseCase';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import type { Message } from '@/src/domain/entities/Message';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 8px;
  padding-vertical: 12px;
  padding-top: 52px;
  background-color: rgba(255, 255, 255, 0.9);
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  margin-left: 4px;
`;

const MessageList = styled(FlatList<Message>)`
  flex: 1;
` as unknown as typeof FlatList;

const BubbleRow = styled.View<{ isUser: boolean }>`
  flex-direction: row;
  justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  margin-vertical: 4px;
  padding-horizontal: 16px;
`;

const Bubble = styled.View<{ isUser: boolean }>`
  max-width: 80%;
  background-color: ${({ isUser, theme }) => (isUser ? theme.colors.primary : theme.colors.surface)};
  border-radius: 16px;
  padding: 12px 16px;
  border-bottom-right-radius: ${(props) => (props.isUser ? '4px' : '16px')};
  border-bottom-left-radius: ${(props) => (props.isUser ? '16px' : '4px')};
`;

const BubbleText = styled.Text<{ isUser: boolean }>`
  font-size: 15px;
  color: ${({ isUser }) => (isUser ? '#fff' : '#1f2937')};
  line-height: 21px;
`;

const InputBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding-horizontal: 16px;
  padding-vertical: 12px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

const ChatInput = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding-horizontal: 16px;
  padding-vertical: 10px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  margin-right: 10px;
`;

const SendButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function ChatRoomScreen() {
  const { id: otherUserId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUserName, setOtherUserName] = useState('Chat');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!user || !otherUserId) return;

    const load = async () => {
      try {
        const repository = new ChatRepositoryImpl();
        const useCase = new GetMessagesUseCase(repository);
        const data = await useCase.execute(user.id, otherUserId);
        setMessages(data);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, otherUserId]);

  useEffect(() => {
    if (!user || !otherUserId) return;

    const repository = new ChatRepositoryImpl();
    const useCase = new SubscribeMessagesUseCase(repository);
    const { unsubscribe } = useCase.execute(user.id, otherUserId, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => unsubscribe();
  }, [user, otherUserId]);

  useEffect(() => {
    if (!otherUserId) return;
    const fetchName = async () => {
      const { supabase } = await import('@/src/data/sources/supabaseClient');
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', otherUserId)
        .single();
      if (data?.name) setOtherUserName(data.name);
    };
    fetchName();
  }, [otherUserId]);

  const handleSend = async () => {
    if (!input.trim() || !user || !otherUserId) return;

    const content = input.trim();
    setInput('');

    try {
      const repository = new ChatRepositoryImpl();
      const useCase = new SendMessageChatUseCase(repository);
      await useCase.execute(user.id, otherUserId, content);
    } catch {
      const { supabase } = await import('@/src/data/sources/supabaseClient');
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: otherUserId,
        content,
      });
      if (error) console.error('Send error:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <AnimatedBackground />
        <Loader>
          <ActivityIndicator size="large" color="#10B981" />
        </Loader>
      </Container>
    );
  }

  return (
    <Container>
      <AnimatedBackground />
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </BackButton>
        <HeaderTitle numberOfLines={1}>{otherUserName}</HeaderTitle>
      </Header>

      <MessageList
        ref={listRef}
        data={messages}
        keyExtractor={(item: Message) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 24 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }: { item: Message }) => {
          const isUser = item.sender_id === user?.id;
          return (
            <BubbleRow isUser={isUser}>
              <Bubble isUser={isUser}>
                <BubbleText isUser={isUser}>{item.content}</BubbleText>
              </Bubble>
            </BubbleRow>
          );
        }}
      />

      <InputBar>
        <ChatInput
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <SendButton onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </SendButton>
      </InputBar>
    </Container>
  );
}
