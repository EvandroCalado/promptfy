import {
  SidebarContent,
  SidebarContentProps,
} from '@/components/shared/sidebar-content';
import { Prompt } from '@/generated/prisma/client';
import { fireEvent, render, screen } from '@/lib/test-utils';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const initialPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Prompt 1',
    description: 'Description 1',
    content: 'Content 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Prompt 2',
    description: 'Description 2',
    content: 'Content 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Prompt 3',
    description: 'Description 3',
    content: 'Content 3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps,
) => render(<SidebarContent prompts={prompts} />);

describe('SidebarContent', () => {
  describe('Base', () => {
    it('should update search input on type', () => {
      makeSut();
      const text = 'test';
      const searchInput = screen.getByRole('searchbox');

      fireEvent.change(searchInput, { target: { value: text } });

      expect(searchInput).toHaveValue(text);
    });

    it('should renders new prompt button', () => {
      makeSut();

      expect(
        screen.getByRole('button', { name: /new prompt/i }),
      ).toBeInTheDocument();
    });

    it('should render prompts list', () => {
      makeSut();

      expect(screen.getByText(initialPrompts[0].title)).toBeInTheDocument();
      expect(screen.getByText(initialPrompts[1].title)).toBeInTheDocument();
      expect(screen.getByText(initialPrompts[2].title)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph').length).toBe(
        initialPrompts.length,
      );
    });
  });

  describe('Sidebar', () => {
    it('should open and close sidebar', () => {
      makeSut();
      const sidebar = screen.getByLabelText('sidebar');
      const button = screen.getByRole('button', {
        name: /open and close menu/i,
      });

      expect(sidebar).toHaveClass('md:w-[20vw]');
      expect(screen.getByText('New prompt')).not.toHaveClass('opacity-0');
      expect(screen.getByText('New prompt')).toHaveClass('opacity-100');

      fireEvent.click(button);

      expect(sidebar).toHaveClass('md:w-22');
      expect(screen.getByText('New prompt')).toHaveClass('opacity-0');
      expect(screen.getByText('New prompt')).not.toHaveClass('opacity-100');
    });
  });

  describe('New prompt', () => {
    it('should navidate to new prompt page', () => {
      makeSut();
      const button = screen.getByRole('button', { name: /new prompt/i });

      fireEvent.click(button);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });

  describe('Search', () => {
    it('should update url on type search and clean', () => {
      makeSut();
      const text = 'a b';
      const searchInput = screen.getByRole('searchbox');

      fireEvent.change(searchInput, { target: { value: text } });

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe('/?q=a%20b');

      fireEvent.change(searchInput, { target: { value: '' } });

      expect(pushMock).toHaveBeenCalled();
      const lastCall2 = pushMock.mock.calls.at(-1);
      expect(lastCall2?.[0]).toBe('/');
    });
  });
});
