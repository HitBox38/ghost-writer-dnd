export type AIProvider = 'openai' | 'anthropic' | 'google';

export type GenerationType = 'mockery' | 'catchphrase';

export interface FavoriteText {
  id: string;
  text: string;
  type: GenerationType;
  context?: string;
  createdAt: number;
}

export interface CharacterProfile {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  appearance: string;
  worldSetting: string;
  characterSheet?: string; // base64 encoded PDF
  favorites: FavoriteText[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  provider: AIProvider;
  apiKey: string; // Currently active API key
  apiKeys: Record<AIProvider, string>; // Store all API keys
  model: string;
  temperature: number;
  theme: 'light' | 'dark' | 'system';
}

export interface GenerationResult {
  id: string;
  text: string;
}

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20241022',
  google: 'gemini-2.5-flash',
};

export const MODEL_OPTIONS: Record<AIProvider, { value: string; label: string }[]> = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
  ],
  google: [
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  ],
};