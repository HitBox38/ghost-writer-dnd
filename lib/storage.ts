import type { AppDataExport, CharacterProfile, Settings } from '@/lib/types'

const STORAGE_KEYS = {
  characters: 'dnd.characters',
  activeProfileId: 'dnd.activeProfileId',
  settings: 'dnd.settings',
  theme: 'dnd.theme',
} as const

export const getStorageKeys = () => ({ ...STORAGE_KEYS })

const isBrowser = (): boolean => typeof window !== 'undefined' && !!window.localStorage

export const readLocal = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const writeLocal = <T>(key: string, value: T): void => {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write errors (quota, etc.)
  }
}

export const removeLocal = (key: string): void => {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

// Characters persistence
export const loadCharacters = (): CharacterProfile[] =>
  readLocal<CharacterProfile[]>(STORAGE_KEYS.characters, [])

export const saveCharacters = (profiles: CharacterProfile[]): void =>
  writeLocal(STORAGE_KEYS.characters, profiles)

export const loadActiveProfileId = (): string | null =>
  readLocal<string | null>(STORAGE_KEYS.activeProfileId, null)

export const saveActiveProfileId = (id: string | null): void =>
  writeLocal(STORAGE_KEYS.activeProfileId, id)

// Settings persistence
export const loadSettings = (): Settings =>
  readLocal<Settings>(STORAGE_KEYS.settings, {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
  })

export const saveSettings = (settings: Settings): void =>
  writeLocal(STORAGE_KEYS.settings, settings)

// Theme
export const loadTheme = (): 'light' | 'dark' =>
  readLocal<'light' | 'dark'>(STORAGE_KEYS.theme, 'dark')

export const saveTheme = (theme: 'light' | 'dark'): void =>
  writeLocal(STORAGE_KEYS.theme, theme)

// Export / Import (apiKey excluded)
export const exportAppData = (): AppDataExport => {
  const profiles = loadCharacters()
  const activeProfileId = loadActiveProfileId()
  const settings = loadSettings()
  const exportPayload: AppDataExport = {
    version: 1,
    exportedAt: Date.now(),
    characters: { profiles, activeProfileId },
    settings: {
      provider: settings.provider,
      model: settings.model,
      temperature: settings.temperature,
    } as Omit<Settings, 'apiKey'>,
  }
  return exportPayload
}

export const downloadJson = (data: unknown, filename: string): void => {
  if (!isBrowser()) return
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const importAppData = (data: AppDataExport): void => {
  // Basic validation
  if (!data || typeof data !== 'object') return
  if (!('characters' in data) || !('settings' in data)) return
  saveCharacters(data.characters.profiles)
  saveActiveProfileId(data.characters.activeProfileId)
  // Reuse existing apiKey; only merge non-secret settings
  const current = loadSettings()
  saveSettings({
    ...current,
    provider: data.settings.provider,
    model: data.settings.model,
    temperature: data.settings.temperature,
  })
}

