import {
  createPromptAction,
  searchPromptsAction,
} from '@/actions/prompt.actions';

const mockedSearchExecute = jest.fn();
const mockedCreateExecute = jest.fn();

jest.mock('@/lib/prisma', () => ({ prisma: {} }));

jest.mock('@/core/application/prompts/search-prompts.use-case', () => ({
  SearchPromptsUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedSearchExecute,
  })),
}));

jest.mock('@/core/application/prompts/create-prompt.use-case', () => ({
  CreatePromptUseCase: jest.fn().mockImplementation(() => ({
    execute: mockedCreateExecute,
  })),
}));

describe('Server Action Prompts', () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateExecute.mockReset();
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

  describe('createPromptAction', () => {
    it('should return error with empty fields', async () => {
      const data = new FormData();
      data.append('title', '');
      data.append('description', '');
      data.append('content', '');

      const result = await createPromptAction({ success: true }, data);

      expect(result.success).toBe(false);
      expect(result.message).toBe(undefined);
      expect(result.fieldErrors).toEqual({
        title: ['Title is required'],
        description: ['Description is required'],
        content: ['Content is required'],
      });
      expect(result.payload).toEqual(data);
    });

    it('should return error with prompt already exists', async () => {
      mockedCreateExecute.mockRejectedValue(
        new Error('Prompt with this title already exists'),
      );
      const data = new FormData();
      data.append('title', 'Existing Prompt');
      data.append('description', 'Description');
      data.append('content', 'Content');

      const result = await createPromptAction({ success: true }, data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Prompt with this title already exists');
      expect(result.fieldErrors).toBe(undefined);
      expect(result.payload).toEqual(data);
    });

    it('should fall back when a non‑error is thrown', async () => {
      mockedCreateExecute.mockRejectedValue(undefined);
      const data = new FormData();
      data.append('title', 'Another Prompt');
      data.append('description', 'Desc');
      data.append('content', 'Cont');

      const result = await createPromptAction({ success: true }, data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Algo deu errado');
      expect(result.fieldErrors).toBeUndefined();
      expect(result.payload).toEqual(data);
    });

    it('should handle when rejection is a plain string', async () => {
      mockedCreateExecute.mockRejectedValue('how dare you');
      const data = new FormData();
      data.append('title', 'String Prompt');
      data.append('description', 'Desc');
      data.append('content', 'Cont');

      const result = await createPromptAction({ success: true }, data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('how dare you');
      expect(result.fieldErrors).toBeUndefined();
      expect(result.payload).toEqual(data);
    });

    it('should extract message from object-like rejection', async () => {
      mockedCreateExecute.mockRejectedValue({ message: 'object msg' });
      const data = new FormData();
      data.append('title', 'Object Prompt');
      data.append('description', 'Desc');
      data.append('content', 'Cont');

      const result = await createPromptAction({ success: true }, data);

      expect(result.success).toBe(false);
      expect(result.message).toBe('object msg');
      expect(result.fieldErrors).toBeUndefined();
      expect(result.payload).toEqual(data);
    });

    it('should create prompt successfully', async () => {
      mockedCreateExecute.mockResolvedValue(undefined);
      const data = new FormData();
      data.append('title', 'New Prompt');
      data.append('description', 'Desc');
      data.append('content', 'Cont');

      const result = await createPromptAction({ success: true }, data);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Prompt created successfully');
      expect(result.fieldErrors).toBeUndefined();
      expect(result.payload).toBeUndefined();
    });
  });
});
