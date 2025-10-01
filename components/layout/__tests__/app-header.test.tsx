import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppHeader } from '../app-header';

describe('AppHeader', () => {
  it('should render application title', () => {
    render(<AppHeader />);
    expect(screen.getByText('D&D Flavor Text Generator')).toBeInTheDocument();
  });

  it('should render settings button', () => {
    render(<AppHeader />);
    // Settings button is an icon button without text, check by title or presence
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render as header element', () => {
    const { container } = render(<AppHeader />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
