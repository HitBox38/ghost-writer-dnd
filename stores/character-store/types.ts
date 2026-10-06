import type { CharacterProfile, FavoriteText } from "@/lib/types";
export interface CharacterStore {
  initialized: boolean;
  characters: CharacterProfile[];
  activeCharacterId: string | null;

  // Character operations
  loadCharacters: () => void;
  addCharacter: (
    character: Omit<CharacterProfile, "id" | "createdAt" | "updatedAt" | "favorites">,
  ) => void;
  updateCharacter: (id: string, updates: Partial<CharacterProfile>) => void;
  deleteCharacter: (id: string) => void;
  setActiveCharacter: (id: string | null) => void;
  getActiveCharacter: () => CharacterProfile | null;

  // Favorites operations
  addFavorite: (
    characterId: string,
    text: string,
    type: FavoriteText["type"],
    context?: string,
  ) => void;
  removeFavorite: (characterId: string, favoriteId: string) => void;

  // Import/Export
  importCharacters: (characters: CharacterProfile[]) => void;
}
