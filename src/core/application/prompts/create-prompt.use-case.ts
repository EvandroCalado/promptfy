import { PromptRepository } from '@/core/domain/prompts/prompt.repository';

import { CreatePromptDto } from './create-prompt.dto';

export class CreatePromptUseCase {
  constructor(private readonly promptRepository: PromptRepository) {}

  async execute(data: CreatePromptDto): Promise<void> {
    const promptExistis = await this.promptRepository.findByTitle(data.title);

    if (promptExistis) {
      throw new Error('Prompt with this title already exists');
    }

    await this.promptRepository.create(data);
  }
}
