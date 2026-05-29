export interface IAssistantRepository {
  sendMessage(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]): Promise<string>;
}
