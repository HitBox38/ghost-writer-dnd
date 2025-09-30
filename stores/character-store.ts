import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  loadActiveProfileId,
  loadCharacters,
  saveActiveProfileId,
  saveCharacters,
} from '@/lib/storage'
import { createId } from '@/lib/types'
import type { CharacterProfile, FavoriteText, GenerationType } from '@/lib/types'

interface CharacterState {
  profiles: CharacterProfile[]
  activeProfileId: string | null
  setActiveProfile: (id: string | null) => void
  createProfile: (payload: Omit<CharacterProfile, 'id' | 'favorites' | 'createdAt' | 'updatedAt'>) => CharacterProfile
  updateProfile: (id: string, updates: Partial<Omit<CharacterProfile, 'id' | 'createdAt'>>) => void
  deleteProfile: (id: string) => void
  addFavorite: (profileId: string, text: string, type: GenerationType) => FavoriteText | null
  removeFavorite: (profileId: string, favoriteId: string) => void
  clearAll: () => void
}

const now = () => Date.now()

const initialProfiles = (): CharacterProfile[] => loadCharacters()
const initialActive = (): string | null => loadActiveProfileId()

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      profiles: initialProfiles(),
      activeProfileId: initialActive(),

      setActiveProfile: (id) => {
        set({ activeProfileId: id })
        saveActiveProfileId(id)
      },

      createProfile: (payload) => {
        const id = createId()
        const profile: CharacterProfile = {
          ...payload,
          id,
          favorites: [],
          createdAt: now(),
          updatedAt: now(),
        }
        const profiles = [profile, ...get().profiles]
        set({ profiles, activeProfileId: id })
        saveCharacters(profiles)
        saveActiveProfileId(id)
        return profile
      },

      updateProfile: (id, updates) => {
        const profiles = get().profiles.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: now() } : p
        )
        set({ profiles })
        saveCharacters(profiles)
      },

      deleteProfile: (id) => {
        const profiles = get().profiles.filter((p) => p.id !== id)
        let activeProfileId = get().activeProfileId
        if (activeProfileId === id) {
          activeProfileId = profiles.length ? profiles[0].id : null
        }
        set({ profiles, activeProfileId })
        saveCharacters(profiles)
        saveActiveProfileId(activeProfileId)
      },

      addFavorite: (profileId, text, type) => {
        const profiles = get().profiles
        const idx = profiles.findIndex((p) => p.id === profileId)
        if (idx === -1) return null
        const favorite: FavoriteText = {
          id: createId(),
          text,
          type,
          createdAt: now(),
        }
        const updated: CharacterProfile = {
          ...profiles[idx],
          favorites: [favorite, ...profiles[idx].favorites],
          updatedAt: now(),
        }
        const next = [...profiles]
        next[idx] = updated
        set({ profiles: next })
        saveCharacters(next)
        return favorite
      },

      removeFavorite: (profileId, favoriteId) => {
        const profiles = get().profiles
        const idx = profiles.findIndex((p) => p.id === profileId)
        if (idx === -1) return
        const updated: CharacterProfile = {
          ...profiles[idx],
          favorites: profiles[idx].favorites.filter((f) => f.id !== favoriteId),
          updatedAt: now(),
        }
        const next = [...profiles]
        next[idx] = updated
        set({ profiles: next })
        saveCharacters(next)
      },

      clearAll: () => {
        set({ profiles: [], activeProfileId: null })
        saveCharacters([])
        saveActiveProfileId(null)
      },
    }),
    {
      name: 'dnd.characters',
      version: 1,
      partialize: (state) => ({ profiles: state.profiles, activeProfileId: state.activeProfileId }),
    }
  )
)

