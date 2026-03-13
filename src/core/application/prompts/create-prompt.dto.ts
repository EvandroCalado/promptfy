import z from 'zod';

export const CreatePromptDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
});

export type CreatePromptDto = z.infer<typeof CreatePromptDto>;
