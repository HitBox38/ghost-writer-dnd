"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { CharacterProfile, FavoriteText, GenerationMode } from '@/lib/types'
import { loadActiveProfileId, saveActiveProfileId } from '@/lib/storage'

type CharacterState = {
  profiles: CharacterProfile[]
  activeProfileId: string | null
  setActiveProfileId: (id: string | null) => void
  createProfile: (data: Omit<CharacterProfile, 'id' | 'favorites' | 'createdAt' | 'updatedAt'>) => string
  updateProfile: (id: string, data: Partial<Omit<CharacterProfile, 'id' | 'favorites' | 'createdAt'>>) => void
  deleteProfile: (id: string) => void
  addFavorite: (profileId: string, text: string, type: GenerationMode) => void
  removeFavorite: (profileId: string, favoriteId: string) => void
}

const emptyProfile = (): CharacterProfile => ({
  id: nanoid(),
  name: '',
  class: '',
  race: '',
  level: 1,
  backstory: '',
  appearance: '',
  worldSetting: '',
  favorites: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

export const useCharacterStore = create(
  persist((set: any, get: any) => ({
      profiles: [],
      activeProfileId: loadActiveProfileId(),
      setActiveProfileId: (id: string | null) => {
        saveActiveProfileId(id)
        set({ activeProfileId: id })
      },
      createProfile: (data: Omit<CharacterProfile, 'id' | 'favorites' | 'createdAt' | 'updatedAt'>) => {
        const profile: CharacterProfile = {
          ...emptyProfile(),
          ...data,
          id: nanoid(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set({ profiles: [profile, ...get().profiles], activeProfileId: profile.id })
        saveActiveProfileId(profile.id)
        return profile.id
      },
      updateProfile: (id: string, data: Partial<Omit<CharacterProfile, 'id' | 'favorites' | 'createdAt'>>) => {
        set({
          profiles: get().profiles.map((p: CharacterProfile) => (p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p)),
        })
      },
      deleteProfile: (id: string) => {
        set({ profiles: get().profiles.filter((p: CharacterProfile) => p.id !== id) })
        if (get().activeProfileId === id) {
          const nextId = get().profiles[0]?.id ?? null
          saveActiveProfileId(nextId)
          set({ activeProfileId: nextId })
        }
      },
      addFavorite: (profileId: string, text: string, type: GenerationMode) => {
        const fav: FavoriteText = { id: nanoid(), text, type, createdAt: Date.now() }
        set({
          profiles: get().profiles.map((p: CharacterProfile) => (p.id === profileId ? { ...p, favorites: [fav, ...p.favorites] } : p)),
        })
      },
      removeFavorite: (profileId: string, favoriteId: string) => {
        set({
          profiles: get().profiles.map((p: CharacterProfile) =>
            p.id === profileId ? { ...p, favorites: p.favorites.filter((f: FavoriteText) => f.id !== favoriteId) } : p,
          ),
        })
      },
    }),
    {
      name: 'dnd.characters.persist',
      version: 1,
    },
  )) as any

