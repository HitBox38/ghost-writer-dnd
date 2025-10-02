import { describe, it, expect, beforeEach } from 'vitest';
import { useResultsStore } from '../results-store';
import type { GenerationResult } from '@/lib/types';

describe('useResultsStore', () => {
  beforeEach(() => {
    useResultsStore.setState({
      results: [],
      generationType: 'mockery',
      context: '',
      favorites: new Set(),
    });
  });

  it('should set results', () => {
    const { setResults } = useResultsStore.getState();
    const mockResults: GenerationResult[] = [
      { id: '1', text: 'Result 1' },
      { id: '2', text: 'Result 2' },
    ];

    setResults(mockResults, 'mockery', 'test context');

    const state = useResultsStore.getState();
    expect(state.results).toEqual(mockResults);
    expect(state.generationType).toBe('mockery');
    expect(state.context).toBe('test context');
    expect(state.favorites.size).toBe(0);
  });

  it('should toggle favorite', () => {
    const { setResults, toggleFavorite } = useResultsStore.getState();
    const mockResults: GenerationResult[] = [{ id: '1', text: 'Result 1' }];

    setResults(mockResults, 'mockery', '');

    toggleFavorite('1');
    expect(useResultsStore.getState().favorites.has('1')).toBe(true);

    toggleFavorite('1');
    expect(useResultsStore.getState().favorites.has('1')).toBe(false);
  });

  it('should clear results', () => {
    const { setResults, clearResults } = useResultsStore.getState();
    const mockResults: GenerationResult[] = [{ id: '1', text: 'Result 1' }];

    setResults(mockResults, 'mockery', 'context');
    clearResults();

    const state = useResultsStore.getState();
    expect(state.results).toEqual([]);
    expect(state.favorites.size).toBe(0);
  });

  it('should set generation type', () => {
    const { setGenerationType } = useResultsStore.getState();

    setGenerationType('catchphrase');

    expect(useResultsStore.getState().generationType).toBe('catchphrase');
  });

  it('should set context', () => {
    const { setContext } = useResultsStore.getState();

    setContext('new context');

    expect(useResultsStore.getState().context).toBe('new context');
  });
});
