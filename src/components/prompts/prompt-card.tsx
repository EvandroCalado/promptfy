import Link from 'next/link';

import { Trash2Icon } from 'lucide-react';

import { PromptEntity } from '@/core/domain/prompts/prompt.entity';

import { Button } from '../ui/button';

type PromptCardProps = {
  prompt: PromptEntity;
};

export const PromptCard = ({ prompt }: PromptCardProps) => {
  return (
    <li
      key={prompt.id}
      className='hover:bg-muted flex items-center justify-between gap-2 rounded-md p-2'
    >
      <header>
        <Link href={`/prompt/${prompt.id}`}>
          <h3
            className='line-clamp-1 font-semibold'
            title={prompt.title}
            aria-label={prompt.title}
          >
            {prompt.title}
          </h3>
          <p
            className='text-muted-foreground/60 line-clamp-1 text-sm'
            title={prompt.description}
            aria-label={prompt.description}
          >
            {prompt.description}
          </p>
        </Link>
      </header>

      <Button
        size={'icon-sm'}
        variant={'destructive'}
        className='cursor-pointer'
        aria-label='Delete prompt'
        title='Delete prompt'
      >
        <Trash2Icon />
      </Button>
    </li>
  );
};
