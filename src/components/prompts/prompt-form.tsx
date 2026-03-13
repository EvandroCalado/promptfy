'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

import { toast } from 'sonner';

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
      toast.success('Prompt saved successfully!');
    }

    if (!state.success) {
      toast.error(state.message || 'Failed to save prompt');
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
    </form>
  );
};
