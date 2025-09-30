export type Provider = 'openai' | 'anthropic' | 'google'

export type GenerationType = 'mockery' | 'catchphrase'

export interface FavoriteText {
  id: string
  text: string
  type: GenerationType
  createdAt: number
}

export interface CharacterProfile {
  id: string
  name: string
  class: string
  race: string
  level: number
  backstory: string
  appearance: string
  worldSetting: string
  characterSheet?: string
  favorites: FavoriteText[]
  createdAt: number
  updatedAt: number
}

export interface Settings {
  provider: Provider
  apiKey: string
  model: string
  temperature: number
}

export interface AppDataExport {
  version: number
  exportedAt: number
  characters: {
    profiles: CharacterProfile[]
    activeProfileId: string | null
  }
  settings: Omit<Settings, 'apiKey'>
}

export const createId = (): string => {
  try {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }
}

