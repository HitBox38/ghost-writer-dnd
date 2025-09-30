import type { CharacterProfile, Settings } from './types';

const STORAGE_KEYS = {
  CHARACTERS: 'dnd-flavor-characters',
  SETTINGS: 'dnd-flavor-settings',
  THEME: 'dnd-flavor-theme',
} as const;

export const storage = {
  // Character operations
  getCharacters(): CharacterProfile[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading characters:', error);
      return [];
    }
  },

  saveCharacters(characters: CharacterProfile[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
    } catch (error) {
      console.error('Error saving characters:', error);
      throw new Error('Failed to save characters. Storage might be full.');
    }
  },

  // Settings operations
  getSettings(): Partial<Settings> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  },

  saveSettings(settings: Settings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings.');
    }
  },

  // Export/Import operations
  exportData(): string {
    const characters = this.getCharacters();
    const settings = this.getSettings();
    
    // Remove API key from export for security
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiKey, ...safeSettings } = settings;
    
    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      characters,
      settings: safeSettings,
    };
    
    return JSON.stringify(exportData, null, 2);
  },

  importData(jsonString: string): { characters: CharacterProfile[]; settings: Partial<Settings> } {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.characters || !Array.isArray(data.characters)) {
        throw new Error('Invalid data format: missing or invalid characters array');
      }
      
      return {
        characters: data.characters,
        settings: data.settings || {},
      };
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data. Please check the file format.');
    }
  },

  // Clear all data
  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // File operations
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },

  downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};