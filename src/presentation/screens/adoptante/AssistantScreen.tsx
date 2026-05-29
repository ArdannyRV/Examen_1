import { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '@/src/presentation/components/ui/AnimatedBackground';
import { MainContainer } from '@/src/presentation/components/ui/Card';

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

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: '¡Hola! Soy el asistente de PetAdopt. ¿En qué puedo ayudarte? Puedes preguntarme sobre cuidados de mascotas, razas, o consejos de adopción.',
    isUser: false,
  },
  {
    id: '2',
    text: '¿Qué cuidados necesita un Golden Retriever?',
    isUser: true,
  },
  {
    id: '3',
    text: 'Los Golden Retrievers necesitan ejercicio diario (al menos 1 hora), cepillado frecuente por su doble capa de pelo, y una dieta balanceada. Son perros muy sociables que requieren atención constante. ¿Te interesa alguna raza en particular?',
    isUser: false,
  },
];

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entiendo tu consulta. Actualmente estoy en modo demo, pero pronto podré darte respuestas más precisas usando inteligencia artificial. 😊',
        isUser: false,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <Container>
      <AnimatedBackground />
      <MainContainer style={{ paddingHorizontal: 16, paddingBottom: 0 }}>
        <MessageList
          data={messages}
          keyExtractor={(item: Message) => item.id}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 120 }}
          renderItem={({ item }: { item: Message }) => (
            <BubbleRow isUser={item.isUser}>
              <Bubble isUser={item.isUser}>
                <BubbleText isUser={item.isUser}>{item.text}</BubbleText>
              </Bubble>
            </BubbleRow>
          )}
        />
      </MainContainer>

      <InputBar>
        <ChatInput
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
        />
        <SendButton onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </SendButton>
      </InputBar>
    </Container>
  );
}
