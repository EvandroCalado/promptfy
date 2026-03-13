import { CreatePromptDto } from '@/core/application/prompts/create-prompt.dto';
import {
  PromptEntity,
  PromptSumary,
} from '@/core/domain/prompts/prompt.entity';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompt.repository';

type PromptDelegateMock = {
  create: jest.MockedFunction<
    (args: { data: CreatePromptDto }) => Promise<void>
  >;
  findFirst: jest.MockedFunction<
    (args: { where: { title: string } }) => Promise<PromptSumary | null>
  >;
  findMany: jest.MockedFunction<
    (args: {
      orderBy?: {
        createdAt: 'desc' | 'asc';
      };
      where?: {
        OR: [
          { title: { contains: string; mode: 'insensitive' } },
          { content: { contains: string; mode: 'insensitive' } },
        ];
      };
    }) => Promise<PromptEntity[]>
  >;
};

type PrismaMock = {
  prompt: PromptDelegateMock;
};

const createMockPrisma = () => {
  const mock: PrismaMock = {
    prompt: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  return mock as unknown as PrismaClient & PrismaMock;
};

describe('PrismaPromptRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaPromptRepository;

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaPromptRepository(prisma);
  });

  describe('create', () => {
    it('should create a new prompt', async () => {
      const input: CreatePromptDto = {
        title: 'Test Prompt',
        description: 'Test Description',
        content: 'Test Content',
      };

      await repository.create(input);

      expect(prisma.prompt.create).toHaveBeenCalledWith({
        data: input,
      });
    });

    it('should throw an error if title already exists', async () => {
      const input: CreatePromptDto = {
        title: 'Existing Prompt',
        description: 'Test Description',
        content: 'Test Content',
      };
      prisma.prompt.findFirst.mockResolvedValue({
        id: '1',
        title: input.title,
        description: input.description,
        content: input.content,
      });

      await expect(repository.create(input)).rejects.toThrow(
        'Prompt with this title already exists',
      );
    });
  });

  describe('findByTitle', () => {
    it('should find a prompt by title', async () => {
      const input: PromptSumary = {
        id: '1',
        title: 'Test Prompt',
        description: 'Test Description',
        content: 'Test Content',
      };
      prisma.prompt.findFirst.mockResolvedValue(input);

      const result = await repository.findByTitle(input.title);

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title: input.title },
      });
      expect(result).toMatchObject(input);
    });

    it('should return null if prompt not found', async () => {
      prisma.prompt.findFirst.mockResolvedValue(null);

      const result = await repository.findByTitle('Nonexistent Prompt');

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title: 'Nonexistent Prompt' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should sort by createdAt in descending order', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '2',
          title: 'Prompt 2',
          description: 'Description 2',
          content: 'Content 2',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.findMany();

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });

  describe('searchMany', () => {
    it('should search by empty term and not call where clause', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany('    ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });

    it('should search by term with spaces and call where clause', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany(' Prompt 01 ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'Prompt 01', mode: 'insensitive' } },
            { content: { contains: 'Prompt 01', mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });
});
