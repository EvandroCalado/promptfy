import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { PromptForm } from '@/components/prompts/prompt-form';

const createPromptActionMock = jest.fn();

jest.mock('@/actions/prompt.actions', () => ({
  createPromptAction: (...args: unknown[]) => createPromptActionMock(...args),
}));

const refreshMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const makeSut = () => render(<PromptForm />);

describe('PromptForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new prompt successfully', async () => {
    createPromptActionMock.mockResolvedValueOnce({ success: true });
    const { container } = makeSut();

    const titleInput = screen.getByPlaceholderText('Prompt title');
    const descriptionInput = screen.getByPlaceholderText('Prompt description');
    const contentInput = screen.getByPlaceholderText('Prompt content');
    const form = container.querySelector('form') as HTMLFormElement;

    fireEvent.change(titleInput, { target: { value: 'Test Prompt' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });

    expect(titleInput).toHaveValue('Test Prompt');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(contentInput).toHaveValue('Test Content');

    fireEvent.submit(form);

    await waitFor(() => expect(createPromptActionMock).toHaveBeenCalled());

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Prompt saved successfully!'),
    );
    expect(refreshMock).toHaveBeenCalled();
  });

  it('should show an error toast when creating a new prompt fails', async () => {
    createPromptActionMock.mockResolvedValueOnce({
      success: false,
      message: 'Something went wrong',
    });
    const { container } = makeSut();

    const titleInput = screen.getByPlaceholderText('Prompt title');
    const descriptionInput = screen.getByPlaceholderText('Prompt description');
    const contentInput = screen.getByPlaceholderText('Prompt content');
    const form = container.querySelector('form');

    fireEvent.change(titleInput, { target: { value: 'Test Prompt' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });

    fireEvent.submit(form!);

    await waitFor(() => expect(createPromptActionMock).toHaveBeenCalled());

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Something went wrong'),
    );
  });
});
