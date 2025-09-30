"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { exportAllData, importAllData, loadApiKey, loadSettings, saveApiKey, saveSettings } from '@/lib/storage'
import type { Settings } from '@/lib/types'
import { testConnection } from '@/lib/ai-generator'

type SettingsState = Settings & {
  setProvider: (provider: Settings['provider']) => void
  setApiKey: (apiKey: string) => void
  setModel: (model: string) => void
  setTemperature: (temperature: number) => void
  exportData: (profilesJson: string) => string
  importData: (json: string) => { ok: boolean; error?: string }
  clearData: () => void
  testConnection: () => Promise<{ ok: boolean; error?: string }>
}

const defaultState: Settings = {
  provider: 'openai',
  apiKey: loadApiKey(),
  model: 'gpt-4o-mini',
  temperature: 0.7,
}

export const useSettingsStore = create(
  persist((set: any, get: any) => ({
      ...defaultState,
      ...(loadSettings() ?? {}),
      setProvider: (provider: Settings['provider']) => {
        const next = { ...get(), provider }
        saveSettings({ provider: next.provider, model: next.model, temperature: next.temperature })
        set({ provider })
      },
      setApiKey: (apiKey: string) => {
        saveApiKey(apiKey)
        set({ apiKey })
      },
      setModel: (model: string) => {
        const next = { ...get(), model }
        saveSettings({ provider: next.provider, model: next.model, temperature: next.temperature })
        set({ model })
      },
      setTemperature: (temperature: number) => {
        const next = { ...get(), temperature }
        saveSettings({ provider: next.provider, model: next.model, temperature: next.temperature })
        set({ temperature })
      },
      exportData: (profilesJson: string) => {
        const { apiKey, ...rest } = get()
        return exportAllData(JSON.parse(profilesJson), {
          provider: rest.provider,
          model: rest.model,
          temperature: rest.temperature,
        })
      },
      importData: (json: string) => {
        const parsed = importAllData(json)
        if (!parsed) return { ok: false, error: 'Invalid file format' }
        saveSettings(parsed.settings)
        set({ ...get(), ...parsed.settings })
        return { ok: true }
      },
      clearData: () => {
        // Clears via character store; settings persist except apiKey removal is manual
        set({})
      },
      testConnection: async () => {
        return await testConnection(get())
      },
    }),
    {
      name: 'dnd.settings.persist',
      partialize: (s: SettingsState) => ({ provider: s.provider, model: s.model, temperature: s.temperature }),
      version: 1,
    },
  )) as any

