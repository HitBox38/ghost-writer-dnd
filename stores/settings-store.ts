import { create } from "zustand";
import { emptyApiKeys, type Settings, type AIProvider } from "@/lib/types";
import { storage } from "@/lib/storage";

interface SettingsStore {
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

const DEFAULT_SETTINGS: Settings = {
  provider: "openai",
  apiKey: "",
  apiKeys: emptyApiKeys(),
  model: "",
  temperature: 0.8,
  reasoningEffort: "provider-default",
  theme: "system",
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: () => {
    const savedSettings = storage.getSettings();
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...savedSettings,
      apiKeys: { ...DEFAULT_SETTINGS.apiKeys, ...savedSettings.apiKeys },
    };
    // Ensure apiKeys object exists for backwards compatibility
    if (!savedSettings.apiKeys) {
      mergedSettings.apiKeys = emptyApiKeys();
      // If there's an old apiKey, assign it to the current provider
      if (mergedSettings.apiKey) {
        mergedSettings.apiKeys[mergedSettings.provider] = mergedSettings.apiKey;
      }
    }
    set({ settings: mergedSettings });
  },

  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates };
    if (updates.apiKey !== undefined)
      settings.apiKeys = { ...settings.apiKeys, [settings.provider]: updates.apiKey };
    else if (updates.provider || updates.apiKeys)
      settings.apiKey = settings.apiKeys[settings.provider] || "";
    storage.saveSettings(settings);
    set({ settings });
  },

  setProvider: (provider) => {
    const currentSettings = get().settings;
    const settings = {
      ...currentSettings,
      provider,
      model: provider === currentSettings.provider ? currentSettings.model : "",
      apiKey: currentSettings.apiKeys[provider] || "",
    };
    storage.saveSettings(settings);
    set({ settings });
  },

  setApiKey: (apiKey) => {
    const currentSettings = get().settings;
    const apiKeys = {
      ...currentSettings.apiKeys,
      [currentSettings.provider]: apiKey,
    };
    get().updateSettings({ apiKey, apiKeys });
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
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }
  },

  exportData: () => {
    const jsonData = storage.exportData();
    const timestamp = new Date().toISOString().split("T")[0];
    storage.downloadFile(jsonData, `dnd-flavor-backup-${timestamp}.json`);
  },

  importData: async (file) => {
    try {
      const text = await file.text();
      const { characters, settings } = storage.importData(text);

      // Import characters (this will be handled by character store)
      const { useCharacterStore } = await import("./character-store");

      // Import settings (preserve current API key if not in import)
      const currentSettings = get().settings;
      const mergedSettings = {
        ...currentSettings,
        ...settings,
        apiKeys: currentSettings.apiKeys,
        apiKey: currentSettings.apiKeys[settings.provider ?? currentSettings.provider] || "",
      };

      const previousCharacters = storage.getCharacters();
      try {
        storage.saveCharacters(characters);
        storage.saveSettings(mergedSettings);
      } catch (error) {
        storage.saveCharacters(previousCharacters);
        storage.saveSettings(currentSettings);
        throw error;
      }
      useCharacterStore.setState({ characters, activeCharacterId: characters[0]?.id ?? null });
      set({ settings: mergedSettings });
      const { useCharacterDraftStore } = await import("./character-draft-store");
      useCharacterDraftStore.getState().reset();
    } catch (error) {
      console.error("Import failed:", error);
      throw error;
    }
  },

  clearAllData: async () => {
    storage.clearAll();
    set({ settings: DEFAULT_SETTINGS });

    // Clear characters (handled by character store)
    const { useCharacterStore } = await import("./character-store");
    useCharacterStore.setState({ characters: [], activeCharacterId: null });
    const { useCharacterDraftStore } = await import("./character-draft-store");
    useCharacterDraftStore.getState().reset();
  },

  isConfigured: () => {
    const { apiKey } = get().settings;
    return apiKey.length > 0;
  },
}));
