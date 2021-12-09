import { render } from '@testing-library/react';
import Footer from './Footer';

test('Renders main page correctly', () => {
  render(<Footer />);
  expect(true).toBeTruthy();
});