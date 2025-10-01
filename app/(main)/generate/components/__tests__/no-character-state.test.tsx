import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoCharacterState } from '../no-character-state';

describe('NoCharacterState', () => {
  it('should render empty state message', () => {
    render(<NoCharacterState />);
    expect(screen.getByText('No Character Selected')).toBeInTheDocument();
    expect(
      screen.getByText(/Create or select a character to start generating/i)
    ).toBeInTheDocument();
  });

  it('should render Sparkles icon', () => {
    const { container } = render(<NoCharacterState />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
