import { create } from 'zustand';
import type { Settings, AIProvider } from '@/lib/types';
import { storage } from '@/lib/storage';
import { DEFAULT_MODELS } from '@/lib/types';

interface SettingsStore {
  settings: Settings;
  
  loadSettings: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (apiKey: string) => void;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  setTheme: (theme: Settings['theme']) => void;
  
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  clearAllData: () => void;
  
  isConfigured: () => boolean;
}

const DEFAULT_SETTINGS: Settings = {
  provider: 'openai',
  apiKey: '',
  model: DEFAULT_MODELS.openai,
  temperature: 0.8,
  theme: 'system',
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: () => {
    const savedSettings = storage.getSettings();
    set({
      settings: { ...DEFAULT_SETTINGS, ...savedSettings },
    });
  },

  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates };
    storage.saveSettings(settings);
    set({ settings });
  },

  setProvider: (provider) => {
    const settings = {
      ...get().settings,
      provider,
      model: DEFAULT_MODELS[provider],
    };
    storage.saveSettings(settings);
    set({ settings });
  },

  setApiKey: (apiKey) => {
    get().updateSettings({ apiKey });
  },

  setModel: (model) => {
    get().updateSettings({ model });
  },

  setTemperature: (temperature) => {
    get().updateSettings({ temperature });
  },

  setTheme: (theme) => {
    get().updateSettings({ theme });
    
    // Apply theme to document
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }
  },

  exportData: () => {
    const jsonData = storage.exportData();
    const timestamp = new Date().toISOString().split('T')[0];
    storage.downloadFile(jsonData, `dnd-flavor-backup-${timestamp}.json`);
  },

  importData: async (file) => {
    try {
      const text = await file.text();
      const { characters, settings } = storage.importData(text);
      
      // Import characters (this will be handled by character store)
      const { useCharacterStore } = await import('./character-store');
      useCharacterStore.getState().importCharacters(characters);
      
      // Import settings (preserve current API key if not in import)
      const currentSettings = get().settings;
      const mergedSettings = {
        ...currentSettings,
        ...settings,
        apiKey: settings.apiKey || currentSettings.apiKey,
      };
      
      storage.saveSettings(mergedSettings);
      set({ settings: mergedSettings });
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  },

  clearAllData: async () => {
    storage.clearAll();
    set({ settings: DEFAULT_SETTINGS });
    
    // Clear characters (handled by character store)
    const { useCharacterStore } = await import('./character-store');
    useCharacterStore.getState().importCharacters([]);
  },

  isConfigured: () => {
    const { apiKey } = get().settings;
    return apiKey.length > 0;
  },
}));