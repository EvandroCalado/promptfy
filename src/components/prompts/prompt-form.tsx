'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

import { createPromptAction } from '@/actions/prompt.actions';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const PromptForm = () => {
  const [state, action, isPending] = useActionState(createPromptAction, {
    success: true,
  });

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form className='space-y-6' action={action}>
      <header className='mb-8 flex flex-wrap items-center justify-end gap-2'>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Prompt'}
        </Button>
      </header>

      <div className='relative'>
        <Input
          name='title'
          placeholder='Prompt title'
          autoFocus
          defaultValue={(state?.payload?.get('title') as string) || ''}
        />
        {state?.fieldErrors?.title && (
          <span className='absolute -bottom-4 left-0 text-xs font-semibold text-red-500'>
            {state.fieldErrors.title.join(', ')}
          </span>
        )}
      </div>

      <div className='relative'>
        <Input
          name='description'
          placeholder='Prompt description'
          defaultValue={(state?.payload?.get('description') as string) || ''}
        />
        {state?.fieldErrors?.description && (
          <span className='absolute -bottom-4 left-0 text-xs font-semibold text-red-500'>
            {state.fieldErrors.description.join(', ')}
          </span>
        )}
      </div>

      <div className='relative'>
        <Textarea
          name='content'
          placeholder='Prompt content'
          defaultValue={(state?.payload?.get('content') as string) || ''}
        />
        {state?.fieldErrors?.content && (
          <span className='absolute -bottom-4 left-0 text-xs font-semibold text-red-500'>
            {state.fieldErrors.content.join(', ')}
          </span>
        )}
      </div>

      {!state?.success && state?.message && (
        <div className='w-full rounded bg-red-50 p-2'>
          <p className='text-xs font-semibold text-red-500'>{state.message}</p>
        </div>
      )}
    </form>
  );
};
