import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { cohere } from '@ai-sdk/cohere';
import { generateText } from 'ai';
import { CharacterProfile, GenerationRequest, Settings } from '@/lib/types';

export class AIGenerator {
  private settings: Settings;
  
  constructor(settings: Settings) {
    this.settings = settings;
  }
  
  private getModel() {
    const { provider, model, apiKey } = this.settings;
    
    switch (provider) {
      case 'openai':
        return openai(model, { apiKey });
      case 'anthropic':
        return anthropic(model, { apiKey });
      case 'google':
        return google(model, { apiKey });
      case 'groq':
        return groq(model, { apiKey });
      case 'cohere':
        return cohere(model, { apiKey });
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
  
  private buildSystemPrompt(profile: CharacterProfile, request: GenerationRequest): string {
    const characterContext = `
Character Profile:
- Name: ${profile.name}
- Race: ${profile.race}
- Class: ${profile.class}
- Level: ${profile.level}

Backstory:
${profile.backstory}

Appearance:
${profile.appearance}

World Setting:
${profile.worldSetting}
`;
    
    if (request.type === 'mockery') {
      return `You are a creative D&D writer helping generate insulting combat quips and vicious mockery for a character. 
      
${characterContext}

Generate 5 creative, witty, and character-appropriate insults or mockery lines that this character would use in combat${request.spellName ? ` when casting ${request.spellName}` : ''}. The insults should:
- Match the character's personality and background
- Be clever and cutting without being overly vulgar
- Feel appropriate for the D&D setting and world
- Be varied in style and approach
- Be memorable and fun to use in game

${request.context ? `Additional context: ${request.context}` : ''}

Provide exactly 5 different mockery lines, each on a new line. Do not number them or add any other formatting.`;
    } else {
      return `You are a creative D&D writer helping generate signature catchphrases for a character.
      
${characterContext}

Generate 5 memorable catchphrases that this character would use regularly. The catchphrases should:
- Reflect the character's personality, background, and values
- Be distinctive and memorable
- Feel natural for the character to say
- Work in various situations (combat, roleplay, etc.)
- Be appropriate for the D&D setting

${request.context ? `Additional context: ${request.context}` : ''}

Provide exactly 5 different catchphrases, each on a new line. Do not number them or add any other formatting.`;
    }
  }
  
  async generate(profile: CharacterProfile, request: GenerationRequest): Promise<string[]> {
    try {
      const model = this.getModel();
      const systemPrompt = this.buildSystemPrompt(profile, request);
      
      const { text } = await generateText({
        model,
        system: systemPrompt,
        prompt: request.type === 'mockery' 
          ? 'Generate 5 vicious mockery lines for my character.'
          : 'Generate 5 catchphrases for my character.',
        temperature: this.settings.temperature,
        maxTokens: 500,
      });
      
      // Split the response into individual lines and filter out empty ones
      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 5); // Ensure we only get 5 lines
      
      // If we got fewer than 5 lines, pad with a default message
      while (lines.length < 5) {
        lines.push(request.type === 'mockery' 
          ? "Your incompetence knows no bounds!"
          : "Adventure awaits!");
      }
      
      return lines;
    } catch (error) {
      console.error('AI Generation error:', error);
      throw new Error('Failed to generate text. Please check your API key and settings.');
    }
  }
}