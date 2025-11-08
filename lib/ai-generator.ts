import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ModelMessage, TextPart, FilePart } from "ai";
import type { CharacterProfile, AIProvider, GenerationType, GenerationResult } from "./types";

export function getAIModel(provider: AIProvider, model: string, apiKey: string) {
  switch (provider) {
    case "openai":
      const openaiProvider = createOpenAI({ apiKey });
      return openaiProvider(model);
    case "anthropic":
      const anthropicProvider = createAnthropic({ apiKey });
      return anthropicProvider(model);
    case "google":
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      return googleProvider(model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function buildPromptText(
  character: CharacterProfile,
  type: GenerationType,
  count: number,
  additionalContext?: string
): string {
  const baseContext = `
Character Profile:
- Name: ${character.name}
- Race: ${character.race}
- Class: ${character.class}
- Level: ${character.level}

Backstory:
${character.backstory || "No backstory provided"}

Appearance:
${character.appearance || "No appearance description provided"}

World/Campaign Setting:
${character.worldSetting || "Standard fantasy setting"}
`.trim();

  const pdfNote = character.characterSheet
    ? "\n\nNote: A character sheet PDF is attached for additional context and details about this character."
    : "";

  if (type === "mockery") {
    return `${baseContext}${pdfNote}

${additionalContext ? `Context: ${additionalContext}\n` : ""}
Generate exactly ${count} creative, in-character insulting combat quips that ${
      character.name
    } would use during battle, particularly when casting spells like Vicious Mockery. These should be witty, cutting, and reflect the character's personality, background, and speech patterns.

Format each quip on a new line starting with a dash (-). Make them memorable, punchy, and battle-ready. Consider the character's class, backstory, and personality traits.

Generate exactly ${count} quips.`;
  } else {
    return `${baseContext}${pdfNote}

${additionalContext ? `Context: ${additionalContext}\n` : ""}
Generate exactly ${count} signature catchphrases that ${
      character.name
    } would say. These should be memorable phrases that capture the character's essence, reflect their personality, backstory, and values. They could be battle cries, philosophical statements, running jokes, or signature sayings.

Format each catchphrase on a new line starting with a dash (-). Make them distinctive and true to the character's voice.

Generate exactly ${count} catchphrases.`;
  }
}

export function buildPrompt(
  character: CharacterProfile,
  type: GenerationType,
  count: number,
  additionalContext?: string
): ModelMessage[] {
  const textContent = buildPromptText(character, type, count, additionalContext);

  const content: Array<TextPart | FilePart> = [
    {
      type: "text",
      text: textContent,
    },
  ];

  // Add PDF if available
  if (character.characterSheet) {
    content.push({
      type: "file",
      data: Buffer.from(character.characterSheet, "base64"),
      mediaType: "application/pdf",
    });
  }

  return [
    {
      role: "user",
      content,
    },
  ];
}

export function parseResults(text: string): GenerationResult[] {
  // Split by lines and filter for lines starting with dash
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.substring(1).trim())
    .filter((line) => line.length > 0);

  return lines.map((text) => ({
    id: crypto.randomUUID(),
    text,
  }));
}

export async function generateFlavorText(
  character: CharacterProfile,
  type: GenerationType,
  provider: AIProvider,
  model: string,
  apiKey: string,
  temperature: number,
  additionalContext?: string,
  count: number = 5
): Promise<GenerationResult[]> {
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
}

export async function testConnection(
  provider: AIProvider,
  model: string,
  apiKey: string
): Promise<boolean> {
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
}
