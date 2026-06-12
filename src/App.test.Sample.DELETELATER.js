

//this file is dummy and does not conatin anything impt. However, this format can be copied
//for testing. Delete whenever before submission.

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
