import { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto';

import { PromptEntity } from './prompt.entity';

export interface PromptRepository {
  create(data: CreatePromptDto): Promise<void>;
  findMany(): Promise<PromptEntity[]>;
  findByTitle(title: string): Promise<PromptEntity | null>;
  searchMany(term?: string): Promise<PromptEntity[]>;
}
