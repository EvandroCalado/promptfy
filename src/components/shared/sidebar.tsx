import { prisma } from '@/lib/prisma';

import { SidebarContent } from './sidebar-content';

export const Sidebar = async () => {
  // always return newest prompts first
  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <aside>
      <SidebarContent prompts={prompts} />
    </aside>
  );
};
