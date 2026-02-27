'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ChevronLeftIcon, PlusIcon } from 'lucide-react';

import { PromptEntity } from '@/core/domain/prompts/prompt.entity';
import { cn } from '@/lib/utils';

import { PromptList } from '../prompts/prompt-list';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Logo } from './logo';

export type SidebarContentProps = {
  prompts: PromptEntity[];
};

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isClosed, setIsClosed] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleNewPrompt = () => router.push('/new');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/';

    setQuery(newQuery);
    router.push(url, { scroll: false });
  };

  return (
    <Card
      title='sidebar'
      aria-label='sidebar'
      className={cn(
        'transition-[transform, width] fh-full fixed top-0 left-0 z-5 w-[80vw] rounded-none border-r duration-300 ease-in-out md:relative md:z-auto md:w-[20vw]',
        {
          'md:w-22': isClosed,
        },
      )}
    >
      <CardContent className='relative space-y-4'>
        <div>
          <Logo isClosed={isClosed} />

          {/* Close button */}
          <Button
            size={'icon-sm'}
            variant={'secondary'}
            title='open and close menu'
            aria-label='open and close menu'
            className='absolute top-0 -right-5 cursor-pointer'
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
        <Input
          type='search'
          id='search'
          name='search'
          placeholder='Search...'
          value={query}
          onChange={handleQueryChange}
          autoFocus
        />

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

        <ScrollArea
          className={cn(
            'transition-[width, opacity] h-[calc(100vh-12rem)] w-full pr-3 duration-150 ease-in-out',
            {
              'pointer-events-none w-0 opacity-0': isClosed,
              'w-full opacity-100': !isClosed,
            },
          )}
          role='navigation'
          aria-label='prompt-list'
          title='prompt-list'
        >
          <PromptList prompts={prompts} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
