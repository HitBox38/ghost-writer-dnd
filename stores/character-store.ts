import { create } from 'zustand';
import type { CharacterProfile, FavoriteText } from '@/lib/types';
import { storage } from '@/lib/storage';

interface CharacterStore {
  characters: CharacterProfile[];
  activeCharacterId: string | null;
  
  // Character operations
  loadCharacters: () => void;
  addCharacter: (character: Omit<CharacterProfile, 'id' | 'createdAt' | 'updatedAt' | 'favorites'>) => void;
  updateCharacter: (id: string, updates: Partial<CharacterProfile>) => void;
  deleteCharacter: (id: string) => void;
  setActiveCharacter: (id: string | null) => void;
  getActiveCharacter: () => CharacterProfile | null;
  
  // Favorites operations
  addFavorite: (characterId: string, text: string, type: FavoriteText['type'], context?: string) => void;
  removeFavorite: (characterId: string, favoriteId: string) => void;
  
  // Import/Export
  importCharacters: (characters: CharacterProfile[]) => void;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: [],
  activeCharacterId: null,

  loadCharacters: () => {
    const characters = storage.getCharacters();
    set({ characters });
  },

  addCharacter: (character) => {
    const newCharacter: CharacterProfile = {
      ...character,
      id: crypto.randomUUID(),
      favorites: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const characters = [...get().characters, newCharacter];
    storage.saveCharacters(characters);
    set({ characters, activeCharacterId: newCharacter.id });
  },

  updateCharacter: (id, updates) => {
    const characters = get().characters.map((char) =>
      char.id === id
        ? { ...char, ...updates, updatedAt: Date.now() }
        : char
    );
    storage.saveCharacters(characters);
    set({ characters });
  },

  deleteCharacter: (id) => {
    const characters = get().characters.filter((char) => char.id !== id);
    storage.saveCharacters(characters);
    
    const activeCharacterId = get().activeCharacterId === id 
      ? (characters[0]?.id || null)
      : get().activeCharacterId;
    
    set({ characters, activeCharacterId });
  },

  setActiveCharacter: (id) => {
    set({ activeCharacterId: id });
  },

  getActiveCharacter: () => {
    const { characters, activeCharacterId } = get();
    return characters.find((char) => char.id === activeCharacterId) || null;
  },

  addFavorite: (characterId, text, type, context) => {
    const favorite: FavoriteText = {
      id: crypto.randomUUID(),
      text,
      type,
      context,
      createdAt: Date.now(),
    };

    const characters = get().characters.map((char) =>
      char.id === characterId
        ? {
            ...char,
            favorites: [...char.favorites, favorite],
            updatedAt: Date.now(),
          }
        : char
    );

    storage.saveCharacters(characters);
    set({ characters });
  },

  removeFavorite: (characterId, favoriteId) => {
    const characters = get().characters.map((char) =>
      char.id === characterId
        ? {
            ...char,
            favorites: char.favorites.filter((fav) => fav.id !== favoriteId),
            updatedAt: Date.now(),
          }
        : char
    );

    storage.saveCharacters(characters);
    set({ characters });
  },

  importCharacters: (importedCharacters) => {
    const characters = importedCharacters;
    storage.saveCharacters(characters);
    set({ 
      characters,
      activeCharacterId: characters[0]?.id || null,
    });
  },
}));