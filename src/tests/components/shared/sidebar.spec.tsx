import { Sidebar } from '@/components/shared/sidebar';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    prompt: {
      findMany: jest.fn(),
    },
  },
}));

describe('Sidebar server component', () => {
  it('should fetch prompts ordered by createdAt desc', async () => {
    const mockPrompts = [{ id: '1' }, { id: '2' }];
    (prisma.prompt.findMany as jest.Mock).mockResolvedValue(mockPrompts);

    const result = await Sidebar();

    expect(prisma.prompt.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });

    // result is a React element, we just verify the call above
    expect(result).toBeDefined();
  });
});
