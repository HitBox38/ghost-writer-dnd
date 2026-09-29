export const AI_PROVIDER_IDS = [
  "openai",
  "anthropic",
  "google",
  "openrouter",
  "xai",
  "groq",
  "mistral",
  "deepseek",
  "cohere",
  "cerebras",
] as const;

export type AIProvider = (typeof AI_PROVIDER_IDS)[number];
export const REASONING_EFFORTS = ["provider-default", "low", "medium", "high"] as const;
export type ReasoningEffort = (typeof REASONING_EFFORTS)[number];

export function isReasoningEffort(value: unknown): value is ReasoningEffort {
  return typeof value === "string" && REASONING_EFFORTS.some((effort) => effort === value);
}

export const AI_PROVIDERS: { id: AIProvider; name: string; url: string }[] = [
  { id: "openai", name: "OpenAI", url: "https://platform.openai.com/api-keys" },
  { id: "anthropic", name: "Anthropic", url: "https://console.anthropic.com/settings/keys" },
  { id: "google", name: "Google", url: "https://aistudio.google.com/apikey" },
  { id: "openrouter", name: "OpenRouter", url: "https://openrouter.ai/settings/keys" },
  { id: "xai", name: "xAI", url: "https://console.x.ai/" },
  { id: "groq", name: "Groq", url: "https://console.groq.com/keys" },
  { id: "mistral", name: "Mistral", url: "https://console.mistral.ai/api-keys/" },
  { id: "deepseek", name: "DeepSeek", url: "https://platform.deepseek.com/" },
  { id: "cohere", name: "Cohere", url: "https://dashboard.cohere.com/" },
  { id: "cerebras", name: "Cerebras", url: "https://cloud.cerebras.ai/" },
];

export function isAIProvider(value: unknown): value is AIProvider {
  return typeof value === "string" && AI_PROVIDER_IDS.some((provider) => provider === value);
}

export function emptyApiKeys(): Record<AIProvider, string> {
  return Object.fromEntries(AI_PROVIDER_IDS.map((provider) => [provider, ""])) as Record<
    AIProvider,
    string
  >;
}

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
  characterSheetMetadata?: { name: string; size: number; uploadedAt: number };
  characterSheet?: string; // base64 encoded PDF
  portrait?: string; // Resized, user-uploaded raster image data URL
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
  reasoningEffort?: ReasoningEffort;
  theme: "light" | "dark" | "system";
  resultLayout?: "grid" | "list";
}

export interface GenerationResult {
  id: string;
  text: string;
}
