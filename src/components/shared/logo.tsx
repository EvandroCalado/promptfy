import Link from 'next/link';

import { RadarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type LogoProps = {
  isClosed?: boolean;
};

export const Logo = ({ isClosed = false }: LogoProps) => {
  return (
    <Link
      href={'/'}
      className='flex h-8 w-fit items-center justify-center gap-1'
    >
      <RadarIcon className='w-9' />
      <span
        className={cn(
          'text-xl tracking-tighter transition-opacity duration-300 ease-in-out',
          {
            'pointer-events-none opacity-0': isClosed,
            'opacity-100': !isClosed,
          },
        )}
      >
        Promptfy
      </span>
    </Link>
  );
};
