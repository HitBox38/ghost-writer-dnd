import type { AIProvider } from "@/lib/types";

export type ModelOption = { value: string; label: string };

type ModelRecord = {
  id?: unknown;
  name?: unknown;
  display_name?: unknown;
  displayName?: unknown;
  supportedGenerationMethods?: unknown;
  architecture?: { input_modalities?: unknown; output_modalities?: unknown };
  input_modalities?: unknown;
  output_modalities?: unknown;
  active?: unknown;
  archived?: unknown;
  is_deprecated?: unknown;
  capabilities?: { completion_chat?: unknown; vision?: unknown };
};

function supportsTextOutput(provider: AIProvider, entry: ModelRecord, id: string): boolean {
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
}

function supportsInlinePdf(provider: AIProvider, entry: ModelRecord, id: string): boolean {
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
}

async function fetchPage(url: URL, headers: HeadersInit) {
  const response = await fetch(url, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error("Couldn't load models from the provider. Check the API key and try again.");
  return response.json() as Promise<Record<string, unknown>>;
}

export async function listProviderModels(
  provider: AIProvider,
  apiKey: string,
  requiresPdf = false,
): Promise<ModelOption[]> {
  if (!apiKey.trim()) throw new Error("Connect this provider to load its models.");

  let url: URL;
  let headers: HeadersInit;
  switch (provider) {
    case "openai":
      url = new URL("https://api.openai.com/v1/models");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    case "anthropic":
      url = new URL("https://api.anthropic.com/v1/models?limit=1000");
      headers = { "x-api-key": apiKey, "anthropic-version": "2023-06-01" };
      break;
    case "google":
      url = new URL("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000");
      headers = { "x-goog-api-key": apiKey };
      break;
    case "openrouter":
      url = new URL("https://openrouter.ai/api/v1/models?output_modalities=text");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    case "xai":
      url = new URL("https://api.x.ai/v1/language-models");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    case "groq":
      url = new URL("https://api.groq.com/openai/v1/models");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    case "mistral":
      url = new URL("https://api.mistral.ai/v1/models");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    case "deepseek":
      url = new URL("https://api.deepseek.com/models");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    case "cohere":
      url = new URL("https://api.cohere.com/v1/models?endpoint=chat&page_size=1000");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    case "cerebras":
      url = new URL("https://api.cerebras.ai/v1/models");
      headers = { Authorization: `Bearer ${apiKey}` };
      break;
    default:
      throw new Error("Unknown provider.");
  }

  const models: ModelOption[] = [];
  for (let page = 0; page < 20; page++) {
    const body = await fetchPage(url, headers);
    const records = ["google", "xai", "cohere"].includes(provider) ? body.models : body.data;
    if (!Array.isArray(records)) throw new Error("The provider returned an invalid model list.");

    for (const entry of records as ModelRecord[]) {
      if (!entry || typeof entry !== "object") continue;
      if (
        provider === "google" &&
        (!Array.isArray(entry.supportedGenerationMethods) ||
          !entry.supportedGenerationMethods.includes("generateContent"))
      )
        continue;
      if (provider === "groq" && entry.active === false) continue;
      if (provider === "mistral" && entry.archived === true) continue;
      if (provider === "cohere" && entry.is_deprecated === true) continue;
      const rawId = provider === "google" || provider === "cohere" ? entry.name : entry.id;
      if (typeof rawId !== "string" || !rawId.trim()) continue;
      const value = provider === "google" ? rawId.replace(/^models\//, "") : rawId;
      if (!supportsTextOutput(provider, entry, value)) continue;
      if (requiresPdf && !supportsInlinePdf(provider, entry, value)) continue;
      const name =
        provider === "anthropic"
          ? entry.display_name
          : provider === "google"
            ? entry.displayName
            : entry.name;
      models.push({ value, label: typeof name === "string" && name.trim() ? name : value });
    }

    if (provider === "anthropic" && body.has_more === true && typeof body.last_id === "string") {
      url.searchParams.set("after_id", body.last_id);
    } else if (
      provider === "google" &&
      typeof body.nextPageToken === "string" &&
      body.nextPageToken
    ) {
      url.searchParams.set("pageToken", body.nextPageToken);
    } else if (
      provider === "cohere" &&
      typeof body.next_page_token === "string" &&
      body.next_page_token
    ) {
      url.searchParams.set("page_token", body.next_page_token);
    } else {
      break;
    }
  }

  return Array.from(new Map(models.map((model) => [model.value, model])).values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}
