import { useState, useRef } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { MainContainer } from '@/src/presentation/components/ui/Card';
import { AssistantRepositoryImpl } from '@/src/data/repositories/AssistantRepositoryImpl';
import { SendMessageUseCase } from '@/src/domain/usecases/SendMessageUseCase';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
`;

const MessageList = styled(FlatList<Message>)`
  flex: 1;
` as unknown as typeof FlatList;

const BubbleRow = styled.View<{ isUser: boolean }>`
  flex-direction: row;
  justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  margin-vertical: 4px;
`;

const Bubble = styled.View<{ isUser: boolean }>`
  max-width: 80%;
  background-color: ${({ isUser, theme }) => (isUser ? theme.colors.primary : theme.colors.surface)};
  border-radius: 16px;
  padding: 12px 16px;
  border-bottom-right-radius: ${(props) => (props.isUser ? '4px' : '16px')};
  border-bottom-left-radius: ${(props) => (props.isUser ? '16px' : '4px')};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const BubbleText = styled.Text<{ isUser: boolean }>`
  font-size: 15px;
  color: ${({ isUser, theme }) => (isUser ? '#fff' : theme.colors.text)};
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

const TypingContainer = styled.View`
  align-items: flex-start;
  margin-vertical: 4px;
`;

const TypingBubble = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 14px 20px;
  border-bottom-left-radius: 4px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const TypingDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.textMuted};
`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy el asistente de PetAdopt. ¿En qué puedo ayudarte? Puedes preguntarme sobre cuidados de mascotas, razas, o consejos de adopción.',
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), text: input.trim(), isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== '1')
        .map((m) => ({
          role: m.isUser ? 'user' as const : 'model' as const,
          parts: [{ text: m.text }],
        }));

      const repository = new AssistantRepositoryImpl();
      const useCase = new SendMessageUseCase(repository);
      const reply = await useCase.execute(userMsg.text, history);

      const botMsg: Message = { id: (Date.now() + 1).toString(), text: reply, isUser: false };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ocurrió un error al procesar tu mensaje. Intenta de nuevo.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <AnimatedBackground />
      <MainContainer style={{ paddingHorizontal: 16, paddingBottom: 0 }}>
        <MessageList
          ref={listRef}
          data={messages}
          keyExtractor={(item: Message) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 120 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }: { item: Message }) => (
            <BubbleRow isUser={item.isUser}>
              <Bubble isUser={item.isUser}>
                <BubbleText isUser={item.isUser}>{item.text}</BubbleText>
              </Bubble>
            </BubbleRow>
          )}
          ListFooterComponent={
            loading ? (
              <TypingContainer>
                <TypingBubble>
                  <TypingDot style={{ opacity: 0.4 }} />
                  <TypingDot style={{ opacity: 0.7 }} />
                  <TypingDot style={{ opacity: 1 }} />
                </TypingBubble>
              </TypingContainer>
            ) : null
          }
        />
      </MainContainer>

      <InputBar>
        <ChatInput
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <SendButton onPress={handleSend} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </SendButton>
      </InputBar>
    </Container>
  );
}
