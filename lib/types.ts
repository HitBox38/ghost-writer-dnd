export type GenerationMode = 'mockery' | 'catchphrase'

export type AIProvider = 'openai' | 'anthropic' | 'google'

export interface FavoriteText {
  id: string;
  text: string;
  type: GenerationMode;
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
  characterSheet?: string; // base64 PDF
  favorites: FavoriteText[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  temperature: number; // 0 - 1
}

export interface ExportDataV1 {
  version: 1;
  profiles: CharacterProfile[];
  settings: Omit<Settings, 'apiKey'>;
}

