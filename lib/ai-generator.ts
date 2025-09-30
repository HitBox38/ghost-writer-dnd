import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { CharacterProfile, AIProvider, GenerationType, GenerationResult } from './types';

function getAIModel(provider: AIProvider, model: string, apiKey: string) {
  switch (provider) {
    case 'openai':
      const openaiProvider = createOpenAI({ apiKey });
      return openaiProvider(model);
    case 'anthropic':
      const anthropicProvider = createAnthropic({ apiKey });
      return anthropicProvider(model);
    case 'google':
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      return googleProvider(model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function buildPrompt(
  character: CharacterProfile,
  type: GenerationType,
  additionalContext?: string
): string {
  const baseContext = `
Character Profile:
- Name: ${character.name}
- Race: ${character.race}
- Class: ${character.class}
- Level: ${character.level}

Backstory:
${character.backstory || 'No backstory provided'}

Appearance:
${character.appearance || 'No appearance description provided'}

World/Campaign Setting:
${character.worldSetting || 'Standard fantasy setting'}
`.trim();

  if (type === 'mockery') {
    return `${baseContext}

${additionalContext ? `Context: ${additionalContext}\n` : ''}
Generate 5 creative, in-character insulting combat quips that ${character.name} would use during battle, particularly when casting spells like Vicious Mockery. These should be witty, cutting, and reflect the character's personality, background, and speech patterns.

Format each quip on a new line starting with a dash (-). Make them memorable, punchy, and battle-ready. Consider the character's class, backstory, and personality traits.

Example format:
- [quip 1]
- [quip 2]
- [quip 3]
- [quip 4]
- [quip 5]`;
  } else {
    return `${baseContext}

${additionalContext ? `Context: ${additionalContext}\n` : ''}
Generate 5 signature catchphrases that ${character.name} would say. These should be memorable phrases that capture the character's essence, reflect their personality, backstory, and values. They could be battle cries, philosophical statements, running jokes, or signature sayings.

Format each catchphrase on a new line starting with a dash (-). Make them distinctive and true to the character's voice.

Example format:
- [catchphrase 1]
- [catchphrase 2]
- [catchphrase 3]
- [catchphrase 4]
- [catchphrase 5]`;
  }
}

function parseResults(text: string): GenerationResult[] {
  // Split by lines and filter for lines starting with dash
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
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
  additionalContext?: string
): Promise<GenerationResult[]> {
  if (!apiKey) {
    throw new Error('API key is required. Please configure it in settings.');
  }

  try {
    const aiModel = getAIModel(provider, model, apiKey);
    const prompt = buildPrompt(character, type, additionalContext);

    const { text } = await generateText({
      model: aiModel,
      prompt,
      temperature,
    });

    const results = parseResults(text);

    if (results.length === 0) {
      throw new Error('No valid results generated. Please try again.');
    }

    return results;
  } catch (error) {
    console.error('AI generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your settings.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit reached. Please try again later.');
      }
      throw error;
    }
    
    throw new Error('Failed to generate text. Please try again.');
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
    console.error('Connection test failed:', error);
    return false;
  }
}