import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CharacterProfile, FavoriteText } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface CharacterStore {
  profiles: CharacterProfile[];
  activeProfileId: string | null;
  
  // Getters
  getActiveProfile: () => CharacterProfile | null;
  
  // Profile management
  createProfile: (profile: Omit<CharacterProfile, 'id' | 'favorites' | 'createdAt' | 'updatedAt'>) => string;
  updateProfile: (id: string, updates: Partial<Omit<CharacterProfile, 'id' | 'createdAt'>>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  
  // Favorites management
  addFavorite: (profileId: string, favorite: Omit<FavoriteText, 'id' | 'createdAt'>) => void;
  removeFavorite: (profileId: string, favoriteId: string) => void;
  
  // Data management
  importProfiles: (profiles: CharacterProfile[]) => void;
  clearAllData: () => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      
      getActiveProfile: () => {
        const state = get();
        if (!state.activeProfileId) return null;
        return state.profiles.find(p => p.id === state.activeProfileId) || null;
      },
      
      createProfile: (profile) => {
        const newProfile: CharacterProfile = {
          ...profile,
          id: generateId(),
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set(state => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: newProfile.id,
        }));
        
        return newProfile.id;
      },
      
      updateProfile: (id, updates) => {
        set(state => ({
          profiles: state.profiles.map(profile =>
            profile.id === id
              ? { ...profile, ...updates, updatedAt: Date.now() }
              : profile
          ),
        }));
      },
      
      deleteProfile: (id) => {
        set(state => ({
          profiles: state.profiles.filter(profile => profile.id !== id),
          activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
        }));
      },
      
      setActiveProfile: (id) => {
        set({ activeProfileId: id });
      },
      
      addFavorite: (profileId, favorite) => {
        const newFavorite: FavoriteText = {
          ...favorite,
          id: generateId(),
          createdAt: Date.now(),
        };
        
        set(state => ({
          profiles: state.profiles.map(profile =>
            profile.id === profileId
              ? {
                  ...profile,
                  favorites: [...profile.favorites, newFavorite],
                  updatedAt: Date.now(),
                }
              : profile
          ),
        }));
      },
      
      removeFavorite: (profileId, favoriteId) => {
        set(state => ({
          profiles: state.profiles.map(profile =>
            profile.id === profileId
              ? {
                  ...profile,
                  favorites: profile.favorites.filter(f => f.id !== favoriteId),
                  updatedAt: Date.now(),
                }
              : profile
          ),
        }));
      },
      
      importProfiles: (profiles) => {
        set({ profiles, activeProfileId: profiles[0]?.id || null });
      },
      
      clearAllData: () => {
        set({ profiles: [], activeProfileId: null });
      },
    }),
    {
      name: 'dnd-character-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);