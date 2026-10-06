"use server";

import { generateText } from "ai";
import { getAIModel, buildPrompt, parseResults, getReasoningOptions } from "@/lib/ai-generator";
import { listProviderModels } from "@/lib/model-catalog";
import type {
  CharacterProfile,
  AIProvider,
  GenerationType,
  GenerationResult,
  ReasoningEffort,
} from "@/lib/types";
export const generateFlavorTextAction = async (
  character: CharacterProfile,
  type: GenerationType,
  provider: AIProvider,
  model: string,
  apiKey: string,
  temperature: number,
  additionalContext?: string,
  count: number = 5,
  reasoningEffort: ReasoningEffort = "provider-default",
): Promise<GenerationResult[]> => {
  if (!apiKey) {
    throw new Error("API key is required. Please configure it in settings.");
  }
  try {
    if (character.characterSheet) {
      const compatibleModels = await listProviderModels(provider, apiKey, true);
      if (!compatibleModels.some(({ value }) => value === model))
        throw new Error("This model can't read the attached PDF. Choose a PDF-compatible model.");
    }
    const aiModel = getAIModel(provider, model, apiKey);
    const messages = buildPrompt(character, type, count, additionalContext);
    const result = await generateText({
      model: aiModel,
      messages,
      temperature,
      ...getReasoningOptions(provider, reasoningEffort),
    });
    const results = parseResults(result.text);
    if (results.length === 0) {
      throw new Error("No valid results generated. Please try again.");
    }
    return results;
  } catch (error) {
    console.error("AI generation error:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Invalid API key. Please check your settings.");
      }
      if (error.message.includes("rate limit")) {
        throw new Error("Rate limit reached. Please try again later.");
      }
      throw error;
    }
    throw new Error("Failed to generate text. Please try again.");
  }
};
