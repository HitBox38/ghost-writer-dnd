import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { loadSettings, saveSettings } from '@/lib/storage'
import type { Provider, Settings } from '@/lib/types'

interface SettingsState extends Settings {
  setProvider: (provider: Provider) => void
  setApiKey: (apiKey: string) => void
  setModel: (model: string) => void
  setTemperature: (temp: number) => void
  reset: () => void
}

const initialState = (): Settings => loadSettings()

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialState(),
      setProvider: (provider) => {
        set({ provider })
        saveSettings({ ...get() })
      },
      setApiKey: (apiKey) => {
        set({ apiKey })
        saveSettings({ ...get() })
      },
      setModel: (model) => {
        set({ model })
        saveSettings({ ...get() })
      },
      setTemperature: (temperature) => {
        const t = Math.max(0, Math.min(1, temperature))
        set({ temperature: t })
        saveSettings({ ...get() })
      },
      reset: () => {
        const defaults: Settings = {
          provider: 'openai',
          apiKey: '',
          model: 'gpt-4o-mini',
          temperature: 0.7,
        }
        set(defaults)
        saveSettings(defaults)
      },
    }),
    {
      name: 'dnd.settings',
      version: 1,
      // Avoid storing duplicate copy via persist's storage; we already call saveSettings
      // but persist enables time-travel and SSR compatibility.
      partialize: (state) => ({ ...state }),
    }
  )
)

