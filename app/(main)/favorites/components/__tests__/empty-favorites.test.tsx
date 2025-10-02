import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyFavorites } from '../empty-favorites';

describe('EmptyFavorites', () => {
  it('should render empty state message', () => {
    render(<EmptyFavorites />);
    expect(screen.getByText('No Favorites Yet')).toBeInTheDocument();
    expect(
      screen.getByText(/Generate some flavor text and click the heart icon/i)
    ).toBeInTheDocument();
  });
});
