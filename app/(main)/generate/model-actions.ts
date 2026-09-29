"use server";

import { listProviderModels } from "@/lib/model-catalog";
import type { AIProvider } from "@/lib/types";

export async function getProviderModelsAction(
  provider: AIProvider,
  apiKey: string,
  requiresPdf = false,
) {
  return listProviderModels(provider, apiKey, requiresPdf);
}
