import { SidebarContent } from '@/components/shared/sidebar-content';
import { fireEvent, render, screen } from '@/lib/test-utils';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const makeSut = () => render(<SidebarContent />);

describe('SidebarContent', () => {
  it('should renders new prompt button', () => {
    makeSut();

    expect(
      screen.getByRole('button', { name: /new prompt/i }),
    ).toBeInTheDocument();
  });

  it('should open and close sidebar', () => {
    makeSut();

    const sidebar = screen.getByLabelText('sidebar');
    const button = screen.getByRole('button', { name: /open and close menu/i });

    expect(sidebar).toHaveClass('md:w-[20vw]');
    expect(screen.getByText('New prompt')).not.toHaveClass('opacity-0');
    expect(screen.getByText('New prompt')).toHaveClass('opacity-100');

    fireEvent.click(button);

    expect(sidebar).toHaveClass('md:w-22');
    expect(screen.getByText('New prompt')).toHaveClass('opacity-0');
    expect(screen.getByText('New prompt')).not.toHaveClass('opacity-100');
  });
});
