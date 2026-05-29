import { IAssistantRepository } from '../repositories/IAssistantRepository';

export class SendMessageUseCase {
  constructor(private readonly assistantRepository: IAssistantRepository) {}

  async execute(
    message: string,
    history: { role: 'user' | 'model'; parts: { text: string }[] }[]
  ): Promise<string> {
    return this.assistantRepository.sendMessage(message, history);
  }
}
