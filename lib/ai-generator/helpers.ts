import type { ModelMessage, TextPart, FilePart } from "ai";
import {
  isReasoningEffort,
  type CharacterProfile,
  type AIProvider,
  type GenerationType,
  type GenerationResult,
  type ReasoningEffort,
} from "@/lib/types";
import { ReasoningOptions } from "./types";
export const getReasoningOptions = (
  provider: AIProvider,
  effort: ReasoningEffort = "provider-default",
): ReasoningOptions => {
  if (!isReasoningEffort(effort) || effort === "provider-default" || provider === "cohere")
    return {};
  if (provider === "mistral")
    return effort === "high"
      ? {
          reasoning: "high",
        }
      : {};
  if (provider === "openrouter")
    return {
      providerOptions: {
        openrouter: {
          reasoning: {
            effort,
          },
        },
      },
    };
  if (provider === "cerebras")
    return {
      providerOptions: {
        cerebras: {
          reasoningEffort: effort,
        },
      },
    };
  return {
    reasoning: effort,
  };
};
export const buildPromptText = (
  character: CharacterProfile,
  type: GenerationType,
  count: number,
  additionalContext?: string,
): string => {
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
Generate exactly ${count} creative, in-character insulting combat quips that ${character.name} would use during battle, particularly when casting spells like Vicious Mockery. These should be witty, cutting, and reflect the character's personality, background, and speech patterns.

Format each quip on a new line starting with a dash (-). Make them memorable, punchy, and battle-ready. Consider the character's class, backstory, and personality traits.

Generate exactly ${count} quips.`;
  } else {
    return `${baseContext}${pdfNote}

${additionalContext ? `Context: ${additionalContext}\n` : ""}
Generate exactly ${count} signature catchphrases that ${character.name} would say. These should be memorable phrases that capture the character's essence, reflect their personality, backstory, and values. They could be battle cries, philosophical statements, running jokes, or signature sayings.

Format each catchphrase on a new line starting with a dash (-). Make them distinctive and true to the character's voice.

Generate exactly ${count} catchphrases.`;
  }
};
export const buildPrompt = (
  character: CharacterProfile,
  type: GenerationType,
  count: number,
  additionalContext?: string,
): ModelMessage[] => {
  const textContent = buildPromptText(character, type, count, additionalContext);
  const content: Array<TextPart | FilePart> = [
    {
      type: "text",
      text: textContent,
    },
  ];

  // Add PDF if available
  if (character.characterSheet) {
    // Extract base64 data from data URL (removes "data:application/pdf;base64," prefix)
    const base64Data = character.characterSheet.includes(",")
      ? character.characterSheet.split(",")[1]
      : character.characterSheet;
    content.push({
      type: "file",
      data: Buffer.from(base64Data, "base64"),
      mediaType: "application/pdf",
    });
  }
  return [
    {
      role: "user",
      content,
    },
  ];
};
export const parseResults = (text: string): GenerationResult[] => {
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
};
