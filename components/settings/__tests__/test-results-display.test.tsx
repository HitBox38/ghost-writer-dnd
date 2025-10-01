import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestResultsDisplay } from '../test-results-display';

describe('TestResultsDisplay', () => {
  it('should render nothing when no results', () => {
    const { container } = render(<TestResultsDisplay testResults={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render successful test results', () => {
    render(<TestResultsDisplay testResults={{ openai: true }} />);
    expect(screen.getByText('openai')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('should render failed test results', () => {
    render(<TestResultsDisplay testResults={{ anthropic: false }} />);
    expect(screen.getByText('anthropic')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('should render multiple test results', () => {
    render(
      <TestResultsDisplay
        testResults={{
          openai: true,
          anthropic: false,
          google: true,
        }}
      />
    );

    expect(screen.getByText('openai')).toBeInTheDocument();
    expect(screen.getByText('anthropic')).toBeInTheDocument();
    expect(screen.getByText('google')).toBeInTheDocument();
    expect(screen.getAllByText('Connected')).toHaveLength(2);
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});
