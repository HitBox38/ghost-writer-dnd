import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButtons } from '../action-buttons';

describe('ActionButtons', () => {
  it('should render copy button', () => {
    const handleCopy = vi.fn();
    render(<ActionButtons onCopy={handleCopy} />);

    expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
  });

  it('should call onCopy when copy button clicked', async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();
    render(<ActionButtons onCopy={handleCopy} />);

    await user.click(screen.getByTitle('Copy to clipboard'));
    expect(handleCopy).toHaveBeenCalledOnce();
  });

  it('should render favorite button when onToggleFavorite provided', () => {
    const handleCopy = vi.fn();
    const handleToggleFavorite = vi.fn();
    render(<ActionButtons onCopy={handleCopy} onToggleFavorite={handleToggleFavorite} />);

    expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
  });

  it('should show favorited state', () => {
    const handleCopy = vi.fn();
    const handleToggleFavorite = vi.fn();
    render(
      <ActionButtons
        onCopy={handleCopy}
        onToggleFavorite={handleToggleFavorite}
        isFavorited={true}
      />
    );

    expect(screen.getByTitle('Remove from favorites')).toBeInTheDocument();
  });

  it('should render delete button when onDelete provided', () => {
    const handleCopy = vi.fn();
    const handleDelete = vi.fn();
    render(<ActionButtons onCopy={handleCopy} onDelete={handleDelete} />);

    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('should call onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();
    const handleDelete = vi.fn();
    render(<ActionButtons onCopy={handleCopy} onDelete={handleDelete} />);

    await user.click(screen.getByTitle('Delete'));
    expect(handleDelete).toHaveBeenCalledOnce();
  });
});
