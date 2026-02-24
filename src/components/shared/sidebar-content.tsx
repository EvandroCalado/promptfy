'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ChevronLeftIcon, PlusIcon } from 'lucide-react';

import { Prompt } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Logo } from './logo';

export type SidebarContentProps = {
  prompts: Prompt[];
};

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const [isClosed, setIsClosed] = useState(false);

  const router = useRouter();

  const handleNewPrompt = () => router.push('/new');

  return (
    <Card
      title='sidebar'
      aria-label='sidebar'
      className={cn(
        'transition-[transform, width] fixed top-0 left-0 z-50 flex h-full w-[80vw] flex-col rounded-none border-r duration-300 ease-in-out md:relative md:z-auto md:w-[20vw]',
        {
          'md:w-22': isClosed,
        },
      )}
    >
      <CardContent className='space-y-4'>
        <div className='relative mx-auto h-8'>
          <Logo isClosed={isClosed} />

          {/* Close button */}
          <Button
            size={'icon-sm'}
            variant={'secondary'}
            title='open and close menu'
            aria-label='open and close menu'
            className='absolute top-0 -right-10 cursor-pointer'
            onClick={() => setIsClosed(!isClosed)}
          >
            <ChevronLeftIcon
              className={cn('transition-transform duration-600 ease-in-out', {
                'rotate-180': isClosed,
                'rotate-0': !isClosed,
              })}
            />
          </Button>
        </div>

        {/* Content */}
        <Button
          title='Add new prompt'
          aria-label='Add new prompt'
          className={cn(
            'transition-[width, gap] cursor-pointer duration-150 ease-in-out',
            {
              'w-full': !isClosed,
              'w-9 gap-0': isClosed,
            },
          )}
          onClick={handleNewPrompt}
        >
          <PlusIcon />
          <span
            className={cn(
              'transition-[opacity, width] duration-300 ease-in-out',
              {
                'pointer-events-none w-0 opacity-0': isClosed,
                'w-fit opacity-100': !isClosed,
              },
            )}
          >
            New prompt
          </span>
        </Button>

        {prompts.map(prompt => (
          <p key={prompt.id}>{prompt.title}</p>
        ))}
      </CardContent>
    </Card>
  );
};
