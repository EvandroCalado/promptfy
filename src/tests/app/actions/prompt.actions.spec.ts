import { searchPromptsAction } from '@/actions/prompt.actions';

const mockedSearchExecute = jest.fn();

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

// jest.mock('@/core/domain/prompts/prompt.repository', () => {
//   return {
//     PromptRepository: jest.fn().mockImplementation(() => {
//       return {
//         findMany: jest.fn(),
//         searchMany: mockedSearchExecute,
//       };
//     }),
//   };
// });

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

describe('Server Action Prompts', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
  });

  describe('searchPromptAction', () => {
    it('should return success with search term', async () => {
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', 'test');

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should return success without search term', async () => {
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
        },
        {
          id: '2',
          title: 'Prompt 2',
          description: 'Description 2',
          content: 'Content 2',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);
      const formData = new FormData();
      formData.append('q', '');

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(result.prompts).toEqual(input);
    });

    it('should return failure on error', async () => {
      const error = new Error('Failed to fetch prompt');
      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append('q', 'test');

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBe(undefined);
      expect(result.message).toBe('Failed to fetch prompts');
    });

    it('should trim search term', async () => {
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append('q', ' prompt 01 ');

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(mockedSearchExecute).toHaveBeenCalledWith('prompt 01');
      expect(result.prompts).toEqual(input);
    });

    it('should return success with query empty', async () => {
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
        },
        {
          id: '2',
          title: 'Prompt 2',
          description: 'Description 2',
          content: 'Content 2',
        },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBe(true);
      expect(mockedSearchExecute).toHaveBeenCalledWith('');
      expect(result.prompts).toEqual(input);
    });
  });
});
