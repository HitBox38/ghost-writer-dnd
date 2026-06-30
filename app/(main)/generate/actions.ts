'use server';

import { generateText } from 'ai';
import { getAIModel, buildPrompt, parseResults } from '@/lib/ai-generator';
import type { CharacterProfile, AIProvider, GenerationType, GenerationResult } from '@/lib/types';

export async function generateFlavorTextAction(
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
    throw new Error('API key is required. Please configure it in settings.');
  }

  try {
    const aiModel = getAIModel(provider, model, apiKey);
    const messages = buildPrompt(character, type, count, additionalContext);

    // Try with PDF first
    let result;
    try {
      result = await generateText({
        model: aiModel,
        messages,
        temperature,
      });
    } catch (pdfError) {
      // If PDF fails, try without it
      if (character.characterSheet && pdfError instanceof Error) {
        console.warn('PDF inclusion failed, retrying without PDF:', pdfError.message);
        
        // Create character without PDF for fallback
        const characterWithoutPDF = { ...character, characterSheet: undefined };
        const messagesWithoutPDF = buildPrompt(characterWithoutPDF, type, count, additionalContext);
        
        result = await generateText({
          model: aiModel,
          messages: messagesWithoutPDF,
          temperature,
        });
      } else {
        throw pdfError;
      }
    }

    const results = parseResults(result.text);

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

