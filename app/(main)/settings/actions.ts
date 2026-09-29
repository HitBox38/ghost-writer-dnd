"use server";

import { listProviderModels } from "@/lib/model-catalog";
import { isAIProvider, type AIProvider } from "@/lib/types";

export async function testProviderAction(provider: AIProvider, apiKey: string) {
  if (!apiKey.trim() || !isAIProvider(provider)) return false;
  try {
    if (provider === "openrouter") {
      const keyResponse = await fetch("https://openrouter.ai/api/v1/key", {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (!keyResponse.ok) return false;
    }
    await listProviderModels(provider, apiKey);
    return true;
  } catch {
    return false;
  }
}
