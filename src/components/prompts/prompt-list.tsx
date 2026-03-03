import { PromptSumary } from '@/core/domain/prompts/prompt.entity';

import { PromptCard } from './prompt-card';

type PromptListProps = {
  prompts: PromptSumary[];
};

export const PromptList = ({ prompts }: PromptListProps) => {
  return (
    <ul className='border-border space-y-6 border-t pt-3'>
      {prompts.map(prompt => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </ul>
  );
};
