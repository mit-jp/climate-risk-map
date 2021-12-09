import { render } from './test-utils';
import Footer from './Footer';
import { screen } from '@testing-library/react';

test('Renders footer correctly', () => {
  render(<Footer />);
  expect(screen.getByText('Accessibility')).toBeInTheDocument();
});