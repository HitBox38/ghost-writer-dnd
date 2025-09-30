export interface CharacterProfile {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  appearance: string;
  worldSetting: string;
  characterSheet?: string; // base64 PDF or file reference
  favorites: FavoriteText[];
  createdAt: number;
  updatedAt: number;
}

export interface FavoriteText {
  id: string;
  text: string;
  type: 'mockery' | 'catchphrase';
  context?: string;
  createdAt: number;
}

export interface Settings {
  provider: 'openai' | 'anthropic' | 'google' | 'groq' | 'cohere';
  apiKey: string;
  model: string;
  temperature: number;
}

export interface GenerationRequest {
  type: 'mockery' | 'catchphrase';
  context?: string;
  spellName?: string;
}

export interface ExportData {
  version: string;
  exportDate: number;
  profiles: CharacterProfile[];
  settings: Omit<Settings, 'apiKey'>;
}