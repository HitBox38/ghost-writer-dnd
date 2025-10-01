import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppFooter } from '../app-footer';

describe('AppFooter', () => {
  it('should render privacy message', () => {
    render(<AppFooter />);
    expect(
      screen.getByText(/Your API key and data never leave your browser/i)
    ).toBeInTheDocument();
  });

  it('should render as footer element', () => {
    const { container } = render(<AppFooter />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
