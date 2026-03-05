'use server';

import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { PromptSumary } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';
import { prisma } from '@/lib/prisma';

export type SearchFormState = {
  success: boolean;
  prompts?: PromptSumary[];
  message?: string;
};

export const searchPromptsAction = async (
  _prevState: SearchFormState,
  formData: FormData,
): Promise<SearchFormState> => {
  const term = formData.get('q')?.toString();
  const repository = new PrismaPromptRepository(prisma);
  const useCase = new SearchPromptsUseCase(repository);

  try {
    const prompts = await useCase.execute(term);

    const summaries = prompts.map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      description: prompt.description,
    }));

    return {
      success: true,
      prompts: summaries,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: 'Failed to fetch prompts',
    };
  }
};
