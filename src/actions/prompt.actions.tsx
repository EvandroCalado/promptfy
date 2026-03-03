'use server';

import { PromptSumary } from '@/core/domain/prompts/prompt.entity';
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
  const query = String(formData.get('q') ?? '').trim();

  try {
    const prompts = await prisma.prompt.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });

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
