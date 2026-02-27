import { Prompt } from '@/generated/prisma/client';

export type PromptEntity = Prompt;

export type PromptSumary = Pick<
  PromptEntity,
  'id' | 'title' | 'description' | 'content'
>;
