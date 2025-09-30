import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Settings, ExportData } from '@/lib/types';
import { useCharacterStore } from './character-store';

interface SettingsStore {
  settings: Settings;
  
  updateSettings: (updates: Partial<Settings>) => void;
  
  // Export/Import
  exportData: () => ExportData;
  importData: (data: ExportData) => void;
  
  // API Key management
  clearApiKey: () => void;
  isApiKeySet: () => boolean;
}

const defaultSettings: Settings = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      updateSettings: (updates) => {
        set(state => ({
          settings: { ...state.settings, ...updates },
        }));
      },
      
      exportData: () => {
        const { profiles } = useCharacterStore.getState();
        const { settings } = get();
        
        return {
          version: '1.0.0',
          exportDate: Date.now(),
          profiles,
          settings: {
            provider: settings.provider,
            model: settings.model,
            temperature: settings.temperature,
          },
        };
      },
      
      importData: (data) => {
        // Import profiles
        useCharacterStore.getState().importProfiles(data.profiles);
        
        // Import settings (excluding API key)
        set(state => ({
          settings: {
            ...state.settings,
            provider: data.settings.provider,
            model: data.settings.model,
            temperature: data.settings.temperature,
          },
        }));
      },
      
      clearApiKey: () => {
        set(state => ({
          settings: { ...state.settings, apiKey: '' },
        }));
      },
      
      isApiKeySet: () => {
        return get().settings.apiKey.length > 0;
      },
    }),
    {
      name: 'dnd-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);