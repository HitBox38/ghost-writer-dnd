import { create } from 'zustand';
import type { GenerationResult, GenerationType } from '@/lib/types';

interface ResultsStore {
  results: GenerationResult[];
  generationType: GenerationType;
  context: string;
  favorites: Set<string>;
  
  setResults: (results: GenerationResult[], type: GenerationType, context: string) => void;
  clearResults: () => void;
  toggleFavorite: (id: string) => void;
  setGenerationType: (type: GenerationType) => void;
  setContext: (context: string) => void;
}

export const useResultsStore = create<ResultsStore>((set) => ({
  results: [],
  generationType: 'mockery',
  context: '',
  favorites: new Set(),

  setResults: (results, type, context) => {
    set({ results, generationType: type, context, favorites: new Set() });
  },

  clearResults: () => {
    set({ results: [], favorites: new Set() });
  },

  toggleFavorite: (id) => {
    set((state) => {
      const newFavorites = new Set(state.favorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return { favorites: newFavorites };
    });
  },

  setGenerationType: (generationType) => {
    set({ generationType });
  },

  setContext: (context) => {
    set({ context });
  },
}));