import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { PromptEntity } from '@/core/domain/prompts/prompt.entity';
import { PromptRepository } from '@/core/domain/prompts/prompt.repository';

describe('SearchPromptsUseCase', () => {
  const mockPrompts: PromptEntity[] = [
    {
      id: '1',
      title: 'Prompt 1',
      description: 'Description 1',
      content: 'Content 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Prompt 2',
      description: 'Description 2',
      content: 'Content 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockRepository: PromptRepository = {
    findMany: async () => mockPrompts,
    searchMany: async (term: string) =>
      mockPrompts.filter(
        prompt =>
          prompt.title.toLowerCase().includes(term.toLowerCase()) ||
          prompt.content.toLowerCase().includes(term.toLowerCase()),
      ),
  };

  it('should return all prompts when no search term is provided', async () => {
    const useCase = new SearchPromptsUseCase(mockRepository);

    const results = await useCase.execute('');

    expect(results).toHaveLength(2);
  });

  it('should filter prompts based on the search term', async () => {
    const useCase = new SearchPromptsUseCase(mockRepository);
    const query = 'prompt 1';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('should search prompts based on the empty spaces term', async () => {
    const findMany = jest.fn().mockResolvedValue(mockPrompts);
    const searchMany = jest.fn().mockResolvedValue([]);

    const mockRepositorySpied: PromptRepository = {
      ...mockRepository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(mockRepositorySpied);
    const query = '  ';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });

  it('should search prompts based on trimmed term', async () => {
    const firstElement = mockPrompts.slice(0, 1);
    const findMany = jest.fn().mockResolvedValue(mockRepository);
    const searchMany = jest.fn().mockResolvedValue(firstElement);

    const mockRepositorySpied: PromptRepository = {
      ...mockRepository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(mockRepositorySpied);
    const query = ' prompt 2 ';

    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(searchMany).toHaveBeenCalledWith(query.trim());
    expect(findMany).not.toHaveBeenCalled();
  });

  it('should handle with term undefined or null', async () => {
    const findMany = jest.fn().mockResolvedValue(mockRepository);
    const searchMany = jest.fn().mockResolvedValue([]);

    const mockRepositorySpied: PromptRepository = {
      ...mockRepository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(mockRepositorySpied);
    const query = undefined;

    const results = await useCase.execute(query);

    expect(results).toMatchObject(mockRepository);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });
});
