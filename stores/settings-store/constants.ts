import { emptyApiKeys, type Settings } from "@/lib/types";
export const DEFAULT_SETTINGS: Settings = {
  provider: "openai",
  apiKey: "",
  apiKeys: emptyApiKeys(),
  model: "",
  temperature: 0.8,
  reasoningEffort: "provider-default",
  theme: "system",
};
