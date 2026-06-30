export type AIProvider = "openai" | "anthropic" | "google" | "openrouter";

export type GenerationType = "mockery" | "catchphrase";

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
  theme: "light" | "dark" | "system";
}

export interface GenerationResult {
  id: string;
  text: string;
}

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: "gpt-5",
  anthropic: "claude-sonnet-4-5",
  google: "gemini-2.5-flash",
  openrouter: "openai/gpt-4o",
};

export const MODEL_OPTIONS: Record<AIProvider, { value: string; label: string }[]> = {
  openai: [
    { value: "gpt-5", label: "GPT-5" },
    { value: "gpt-5-mini", label: "GPT-5 Mini" },
    { value: "gpt-5-nano", label: "GPT-5 Nano" },
    { value: "gpt-5-pro", label: "GPT-5 Pro" },
    { value: "gpt-4.1", label: "GPT-4.1" },
    { value: "o4-mini", label: "GPT-o4 Mini" },
    { value: "gpt-4o", label: "GPT-o4 Nano" },
    { value: "gpt-oss-120b", label: "GPT-OSS 120b" },
    { value: "gpt-oss-20b", label: "GPT-OSS 20b" },
    { value: "o1-2024-12-17", label: "GPT-o1" },
  ],
  anthropic: [
    { value: "claude-sonnet-4-5", label: "Claude 4.5 Sonnet" },
    { value: "claude-sonnet-4-0", label: "Claude 4 Sonnet" },
    { value: "claude-opus-4-1", label: "Claude 4.1 Opus" },
    { value: "claude-opus-4-0", label: "Claude 4 Opus" },
    { value: "claude-3-7-sonnet-latest", label: "Claude 3.7 Sonnet" },
    { value: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
  ],
  google: [
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  ],
  openrouter: [
    { value: "amazon/nova-2-lite-v1", label: "Amazon Nova 2 Lite" },
    { value: "openai/gpt-5.2-chat", label: "OpenAI GPT-5.2 Chat" },
    { value: "openai/gpt-5.2-pro", label: "OpenAI GPT-5.2 Pro" },
    { value: "openai/gpt-5.2", label: "OpenAI GPT-5.2" },
    { value: "openai/gpt-5.1", label: "OpenAI GPT-5.1" },
    { value: "openai/gpt-5.1-chat", label: "OpenAI GPT-5.1 Chat" },
    { value: "openai/gpt-5.1-pro", label: "OpenAI GPT-5.1 Pro" },
    { value: "openai/gpt-5-pro", label: "OpenAI GPT-5 Pro" },
    { value: "openai/gpt-5-chat", label: "OpenAI GPT-5 Chat" },
    { value: "openai/gpt-5", label: "OpenAI GPT-5" },
    { value: "openai/gpt-5-mini", label: "OpenAI GPT-5 Mini" },
    { value: "openai/gpt-5-nano", label: "OpenAI GPT-5 Nano" },
    { value: "openai/o3-deep-research", label: "OpenAI GPT-o3 Deep Research" },
    { value: "openai/o3-pro", label: "OpenAI GPT-o3 Pro" },
    { value: "openai/o4-mini-deep-research", label: "OpenAI GPT-o4 Mini Deep Research" },
    { value: "anthropic/claude-opus-4.5", label: "Claude 4 Opus 4.5" },
    { value: "anthropic/claude-sonnet-4.5", label: "Claude 4 Sonnet 4.5" },
    { value: "anthropic/claude-opus-4.1", label: "Claude 4 Opus 4.1" },
    { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
    { value: "google/gemini-2.5-flash-lite-preview-09-2025", label: "Gemini 2.5 Flash Lite 09-2025" },
    { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
    { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash" },
    { value: "google/gemini-3-pro-preview", label: "Gemini 3 Pro" },
    { value: "openrouter/auto", label: "Auto" },
  ],
};
