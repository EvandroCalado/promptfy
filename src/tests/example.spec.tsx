import { render, screen } from '@/lib/test-utils';

describe('Example', () => {
  it('should render', () => {
    render(<h1>Hello</h1>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
