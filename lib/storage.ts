import { CharacterProfile, ExportDataV1, Settings } from '@/lib/types'

const STORAGE_KEYS = {
  profiles: 'dnd.profiles.v1',
  activeProfileId: 'dnd.activeProfileId.v1',
  settings: 'dnd.settings.v1',
  apiKey: 'dnd.apiKey.v1',
  theme: 'dnd.theme.v1',
} as const

export const safeLocalStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(key, value)
    } catch {
      // ignore
    }
  },
  remove: (key: string): void => {
    try {
      if (typeof window === 'undefined') return
      window.localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}

export const saveProfiles = (profiles: CharacterProfile[]) => {
  safeLocalStorage.set(STORAGE_KEYS.profiles, JSON.stringify(profiles))
}

export const loadProfiles = (): CharacterProfile[] => {
  const raw = safeLocalStorage.get(STORAGE_KEYS.profiles)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as CharacterProfile[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveSettings = (settings: Omit<Settings, 'apiKey'>) => {
  safeLocalStorage.set(STORAGE_KEYS.settings, JSON.stringify(settings))
}

export const loadSettings = (): Omit<Settings, 'apiKey'> | null => {
  const raw = safeLocalStorage.get(STORAGE_KEYS.settings)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Omit<Settings, 'apiKey'>
  } catch {
    return null
  }
}

export const saveApiKey = (apiKey: string) => {
  safeLocalStorage.set(STORAGE_KEYS.apiKey, apiKey)
}

export const loadApiKey = (): string => {
  return safeLocalStorage.get(STORAGE_KEYS.apiKey) ?? ''
}

export const saveActiveProfileId = (id: string | null) => {
  if (id) safeLocalStorage.set(STORAGE_KEYS.activeProfileId, id)
  else safeLocalStorage.remove(STORAGE_KEYS.activeProfileId)
}

export const loadActiveProfileId = (): string | null => {
  return safeLocalStorage.get(STORAGE_KEYS.activeProfileId)
}

export const exportAllData = (
  profiles: CharacterProfile[],
  settings: Omit<Settings, 'apiKey'>,
): string => {
  const payload: ExportDataV1 = {
    version: 1,
    profiles,
    settings,
  }
  return JSON.stringify(payload, null, 2)
}

export const importAllData = (json: string): ExportDataV1 | null => {
  try {
    const parsed = JSON.parse(json) as ExportDataV1
    if (parsed && parsed.version === 1 && Array.isArray(parsed.profiles) && parsed.settings) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export const clearAllData = () => {
  safeLocalStorage.remove(STORAGE_KEYS.profiles)
  safeLocalStorage.remove(STORAGE_KEYS.activeProfileId)
  safeLocalStorage.remove(STORAGE_KEYS.settings)
  // Intentionally do not remove API key to avoid accidental loss
}

export const themeStorage = {
  get: (): 'light' | 'dark' | null => {
    const v = safeLocalStorage.get(STORAGE_KEYS.theme)
    return v === 'light' || v === 'dark' ? v : null
  },
  set: (v: 'light' | 'dark') => safeLocalStorage.set(STORAGE_KEYS.theme, v),
}

