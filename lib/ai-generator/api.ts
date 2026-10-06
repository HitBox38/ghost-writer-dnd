import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogle } from "@ai-sdk/google";
import { createXai } from "@ai-sdk/xai";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createCohere } from "@ai-sdk/cohere";
import { createCerebras } from "@ai-sdk/cerebras";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  type CharacterProfile,
  type AIProvider,
  type GenerationType,
  type GenerationResult,
  type ReasoningEffort,
} from "@/lib/types";
import { buildPrompt, parseResults, getReasoningOptions } from "./helpers";
export const getAIModel = (provider: AIProvider, model: string, apiKey: string) => {
  switch (provider) {
    case "openai": {
      const openaiProvider = createOpenAI({
        apiKey,
      });
      return openaiProvider(model);
    }
    case "anthropic": {
      const anthropicProvider = createAnthropic({
        apiKey,
      });
      return anthropicProvider(model);
    }
    case "google": {
      const googleProvider = createGoogle({
        apiKey,
      });
      return googleProvider(model);
    }
    case "openrouter": {
      const openrouterProvider = createOpenRouter({
        apiKey,
      });
      return openrouterProvider(model);
    }
    case "xai":
      return createXai({
        apiKey,
      })(model);
    case "groq":
      return createGroq({
        apiKey,
      })(model);
    case "mistral":
      return createMistral({
        apiKey,
      })(model);
    case "deepseek":
      return createDeepSeek({
        apiKey,
      })(model);
    case "cohere":
      return createCohere({
        apiKey,
      })(model);
    case "cerebras":
      return createCerebras({
        apiKey,
      })(model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
};
export const generateFlavorText = async (
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
    const aiModel = getAIModel(provider, model, apiKey);
    const messages = buildPrompt(character, type, count, additionalContext);
    const { text } = await generateText({
      model: aiModel,
      messages,
      temperature,
      ...getReasoningOptions(provider, reasoningEffort),
    });
    const results = parseResults(text);
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
export const testConnection = async (
  provider: AIProvider,
  model: string,
  apiKey: string,
): Promise<boolean> => {
  try {
    const aiModel = getAIModel(provider, model, apiKey);
    await generateText({
      model: aiModel,
      prompt: 'Say "OK"',
    });
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
};
