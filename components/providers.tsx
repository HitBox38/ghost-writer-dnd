'use client';

import { useEffect } from 'react';
import { useCharacterStore } from '@/stores/character-store';
import { useSettingsStore } from '@/stores/settings-store';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const { loadCharacters } = useCharacterStore();
  const { loadSettings, setTheme, settings } = useSettingsStore();

  useEffect(() => {
    // Load data from localStorage on mount
    loadCharacters();
    loadSettings();
  }, [loadCharacters, loadSettings]);

  useEffect(() => {
    // Apply theme on mount and when it changes
    setTheme(settings.theme);
  }, [settings.theme, setTheme]);

  return <>{children}</>;
};