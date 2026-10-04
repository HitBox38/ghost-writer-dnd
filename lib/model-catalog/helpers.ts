import type { AIProvider } from "@/lib/types";
import { ModelRecord } from "./types";
export const supportsTextOutput = (
  provider: AIProvider,
  entry: ModelRecord,
  id: string,
): boolean => {
  const input = entry.architecture?.input_modalities ?? entry.input_modalities;
  if (Array.isArray(input) && !input.includes("text")) return false;
  const output = entry.architecture?.output_modalities ?? entry.output_modalities;
  if (Array.isArray(output) && !output.includes("text")) return false;

  // Some catalog APIs return IDs without modality metadata. Exclude known non-text families
  // without requiring a code change each time a new text model family appears.
  switch (provider) {
    case "openai":
      return !/(?:image|dall-e|sora|audio|realtime|transcrib|whisper|tts|speech|video|moderation|embedding|computer-use)/i.test(
        id,
      );
    case "anthropic":
      return /^claude-/i.test(id);
    case "google":
      return !/(?:image|imagen|audio|lyria|live|transcrib|tts|speech|video|veo|embedding)/i.test(
        id,
      );
    case "groq":
      return !/(?:whisper|orpheus|playai|guard|safeguard|safety|tts|speech|transcrib)/i.test(id);
    case "mistral":
      return entry.capabilities?.completion_chat === true;
    default:
      return true;
  }
};
export const supportsInlinePdf = (
  provider: AIProvider,
  entry: ModelRecord,
  id: string,
): boolean => {
  switch (provider) {
    case "openai":
      return /^(?:gpt-(?:4o|4\.1|[5-9]|[1-9]\d)|o[1-9]|ft:(?:gpt-(?:4o|4\.1|[5-9]|[1-9]\d)|o[1-9]))/i.test(
        id,
      );
    case "anthropic":
      return /^claude-[3-9]/i.test(id);
    case "google":
      return /^gemini-/i.test(id);
    case "openrouter":
      return (
        Array.isArray(entry.architecture?.input_modalities) &&
        entry.architecture.input_modalities.includes("file")
      );
    case "mistral":
      return entry.capabilities?.vision === true;
    default:
      return false;
  }
};
