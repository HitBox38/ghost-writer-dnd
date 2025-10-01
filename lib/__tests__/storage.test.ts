import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../storage';
import type { CharacterProfile, Settings } from '../types';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getCharacters', () => {
    it('should return empty array when no characters stored', () => {
      expect(storage.getCharacters()).toEqual([]);
    });

    it('should return stored characters', () => {
      const characters: CharacterProfile[] = [
        {
          id: '1',
          name: 'Test',
          class: 'Wizard',
          race: 'Elf',
          level: 5,
          backstory: '',
          appearance: '',
          worldSetting: '',
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem('dnd-flavor-characters', JSON.stringify(characters));
      expect(storage.getCharacters()).toEqual(characters);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('dnd-flavor-characters', 'invalid json');
      expect(storage.getCharacters()).toEqual([]);
    });
  });

  describe('saveCharacters', () => {
    it('should save characters to localStorage', () => {
      const characters: CharacterProfile[] = [
        {
          id: '1',
          name: 'Test',
          class: 'Wizard',
          race: 'Elf',
          level: 5,
          backstory: '',
          appearance: '',
          worldSetting: '',
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      storage.saveCharacters(characters);
      expect(JSON.parse(localStorage.getItem('dnd-flavor-characters')!)).toEqual(characters);
    });
  });

  describe('exportData', () => {
    it('should export data without API key', () => {
      const characters: CharacterProfile[] = [];
      const settings: Settings = {
        provider: 'openai',
        apiKey: 'secret-key',
        apiKeys: { openai: 'secret', anthropic: '', google: '' },
        model: 'gpt-4o',
        temperature: 0.8,
        theme: 'dark',
      };

      localStorage.setItem('dnd-flavor-characters', JSON.stringify(characters));
      localStorage.setItem('dnd-flavor-settings', JSON.stringify(settings));

      const exported = storage.exportData();
      const data = JSON.parse(exported);

      expect(data.characters).toEqual(characters);
      expect(data.settings.apiKey).toBeUndefined();
      expect(data.version).toBe('1.0.0');
      expect(data.exportDate).toBeDefined();
    });
  });

  describe('importData', () => {
    it('should import valid data', () => {
      const jsonData = JSON.stringify({
        characters: [],
        settings: { provider: 'openai' },
      });

      const result = storage.importData(jsonData);
      expect(result.characters).toEqual([]);
      expect(result.settings.provider).toBe('openai');
    });

    it('should throw error for invalid data', () => {
      expect(() => storage.importData('invalid')).toThrow();
    });

    it('should throw error for missing characters', () => {
      const jsonData = JSON.stringify({ settings: {} });
      expect(() => storage.importData(jsonData)).toThrow('Failed to import data');
    });
  });

  describe('fileToBase64', () => {
    it('should convert file to base64', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const base64 = await storage.fileToBase64(file);
      expect(base64).toContain('data:application/pdf;base64');
    });
  });

  describe('clearAll', () => {
    it('should clear all stored data', () => {
      localStorage.setItem('dnd-flavor-characters', '[]');
      localStorage.setItem('dnd-flavor-settings', '{}');
      storage.clearAll();
      expect(localStorage.getItem('dnd-flavor-characters')).toBeNull();
      expect(localStorage.getItem('dnd-flavor-settings')).toBeNull();
    });
  });
});
