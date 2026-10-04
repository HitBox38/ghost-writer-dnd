"use server";

import { listProviderModels } from "@/lib/model-catalog";
import type { AIProvider } from "@/lib/types";
export const getProviderModelsAction = async (
  provider: AIProvider,
  apiKey: string,
  requiresPdf = false,
) => {
  return listProviderModels(provider, apiKey, requiresPdf);
};
