import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAssistantRepository } from '../../domain/repositories/IAssistantRepository';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '');

const SYSTEM_PROMPT = 'Eres un asistente experto en salud, cuidado y adopción de mascotas (perros, gatos, etc). Sé amable, conciso y responde en español.';

export class AssistantRepositoryImpl implements IAssistantRepository {
  async sendMessage(
    message: string,
    history: { role: 'user' | 'model'; parts: { text: string }[] }[]
  ): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Entendido. Seré tu asistente experto en mascotas.' }] },
          ...history,
        ],
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }
}
