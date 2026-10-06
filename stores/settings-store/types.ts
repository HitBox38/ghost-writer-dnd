import { type Settings, type AIProvider } from "@/lib/types";
export interface SettingsStore {
  settings: Settings;
  loadSettings: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (apiKey: string) => void;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  setTheme: (theme: Settings["theme"]) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  clearAllData: () => Promise<void>;
  isConfigured: () => boolean;
}
