'use server';

import { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto';
import { CreatePromptUseCase } from '@/core/application/prompts/create-prompt.use-case';
import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { PromptSumary } from '@/core/domain/prompts/prompt.entity';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';
import { prisma } from '@/lib/prisma';
import {
  InitialFormState,
  formErrorHandler,
} from '@/utils/form-error-handler.util';

export type SearchFormState = {
  success: boolean;
  prompts?: PromptSumary[];
  message?: string;
};

export const searchPromptsAction = async (
  _prevState: SearchFormState,
  formData: FormData,
): Promise<SearchFormState> => {
  const term = String(formData.get('q') ?? '').trim();
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
  } catch {
    return {
      success: false,
      message: 'Failed to fetch prompts',
    };
  }
};

export const createPromptAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  try {
    const validation = CreatePromptDto.parse(Object.fromEntries(formData));

    const repository = new PrismaPromptRepository(prisma);
    const useCase = new CreatePromptUseCase(repository);

    await useCase.execute(validation);

    return {
      success: true,
      message: 'Prompt created successfully',
    };
  } catch (error) {
    return formErrorHandler(error, formData);
  }
};
