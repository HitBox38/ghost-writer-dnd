import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../settings-store';
import { DEFAULT_MODELS } from '@/lib/types';

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({
      settings: {
        provider: 'openai',
        apiKey: '',
        apiKeys: { openai: '', anthropic: '', google: '' },
        model: DEFAULT_MODELS.openai,
        temperature: 0.8,
        theme: 'system',
      },
    });
  });

  it('should update settings', () => {
    const { updateSettings } = useSettingsStore.getState();
    updateSettings({ temperature: 0.5 });

    expect(useSettingsStore.getState().settings.temperature).toBe(0.5);
  });

  it('should set provider and update model', () => {
    const { setProvider } = useSettingsStore.getState();
    setProvider('anthropic');

    const state = useSettingsStore.getState();
    expect(state.settings.provider).toBe('anthropic');
    expect(state.settings.model).toBe(DEFAULT_MODELS.anthropic);
  });

  it('should set API key for current provider', () => {
    const { setApiKey } = useSettingsStore.getState();
    setApiKey('test-key');

    const state = useSettingsStore.getState();
    expect(state.settings.apiKey).toBe('test-key');
    expect(state.settings.apiKeys.openai).toBe('test-key');
  });

  it('should switch provider and load correct API key', () => {
    const { updateSettings, setProvider } = useSettingsStore.getState();

    // Set OpenAI key
    updateSettings({
      apiKeys: { openai: 'openai-key', anthropic: 'anthropic-key', google: '' },
    });

    // Switch to Anthropic
    setProvider('anthropic');

    const state = useSettingsStore.getState();
    expect(state.settings.provider).toBe('anthropic');
    expect(state.settings.apiKey).toBe('anthropic-key');
  });

  it('should check if configured', () => {
    const { isConfigured, updateSettings } = useSettingsStore.getState();

    expect(isConfigured()).toBe(false);

    updateSettings({ apiKey: 'test-key' });

    expect(isConfigured()).toBe(true);
  });

  it('should load settings from localStorage', () => {
    const mockSettings = {
      provider: 'anthropic' as const,
      apiKey: 'test-key',
      apiKeys: { openai: '', anthropic: 'test-key', google: '' },
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.9,
      theme: 'dark' as const,
    };

    localStorage.setItem('dnd-flavor-settings', JSON.stringify(mockSettings));

    const { loadSettings } = useSettingsStore.getState();
    loadSettings();

    expect(useSettingsStore.getState().settings.provider).toBe('anthropic');
    expect(useSettingsStore.getState().settings.apiKey).toBe('test-key');
  });

  it('should migrate old settings format', () => {
    const oldSettings = {
      provider: 'openai' as const,
      apiKey: 'old-key',
      model: 'gpt-4o',
      temperature: 0.7,
      theme: 'light' as const,
    };

    localStorage.setItem('dnd-flavor-settings', JSON.stringify(oldSettings));

    const { loadSettings } = useSettingsStore.getState();
    loadSettings();

    const state = useSettingsStore.getState();
    expect(state.settings.apiKeys).toBeDefined();
    // The migration creates the apiKeys object but starts with empty strings
    expect(state.settings.apiKeys).toHaveProperty('openai');
    expect(state.settings.apiKeys).toHaveProperty('anthropic');
    expect(state.settings.apiKeys).toHaveProperty('google');
  });
});
