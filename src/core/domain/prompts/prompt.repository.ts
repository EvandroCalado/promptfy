import { PromptEntity } from './prompt.entity';

export interface PromptRepository {
  findMany(): Promise<PromptEntity[]>;
  searchMany(term?: string): Promise<PromptEntity[]>;
}
