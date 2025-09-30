import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

import type { CharacterProfile, GenerationType, Provider, Settings } from '@/lib/types'

type ProviderClient = ReturnType<typeof createOpenAI> | ReturnType<typeof createAnthropic> | ReturnType<typeof createGoogleGenerativeAI>

export interface GenerationRequest {
  character: CharacterProfile
  type: GenerationType
  extraContext?: string
  count?: number // 3-5
  settings: Settings
}

export interface GenerationResult {
  lines: string[]
}

const getProviderClient = (provider: Provider, apiKey: string): ProviderClient => {
  if (!apiKey) {
    throw new Error('Missing API key')
  }
  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey })
    case 'anthropic':
      return createAnthropic({ apiKey })
    case 'google':
      return createGoogleGenerativeAI({ apiKey })
    default:
      // exhaustive check
      throw new Error(`Unsupported provider: ${String(provider)}`)
  }
}

const buildSystemPrompt = (character: CharacterProfile, type: GenerationType): string => {
  const base = [
    `You are a witty Dungeons & Dragons flavor text writer.`,
    `Write short, punchy lines matching the character's personality.`,
    `Avoid profanity and modern slang unless fitting the setting.`,
  ]

  const persona = [
    `Character: ${character.name}, level ${character.level} ${character.race} ${character.class}.`,
    `Appearance: ${character.appearance || 'N/A'}.`,
    `World: ${character.worldSetting || 'N/A'}.`,
    `Backstory: ${character.backstory || 'N/A'}.`,
  ]

  const instruction =
    type === 'mockery'
      ? 'Task: Generate insulting combat quips suitable for spells like Vicious Mockery. Keep each line under 140 characters.'
      : 'Task: Generate memorable character catchphrases. Keep each line under 120 characters.'

  return [...base, ...persona, instruction].join('\n')
}

const buildUserPrompt = (type: GenerationType, extraContext?: string, count: number = 4): string => {
  const goal = type === 'mockery' ? 'Insulting combat quips' : 'Signature catchphrases'
  const context = extraContext?.trim() ? `Context: ${extraContext.trim()}` : 'Context: None'
  return [
    `${goal} requested.`,
    context,
    `Output: Return ${count} distinct lines, numbered 1..${count}. No extra commentary.`,
  ].join('\n')
}

export const generateFlavorText = async (req: GenerationRequest): Promise<GenerationResult> => {
  const { settings, character, type, extraContext, count = 4 } = req
  const client = getProviderClient(settings.provider, settings.apiKey)
  const system = buildSystemPrompt(character, type)
  const prompt = buildUserPrompt(type, extraContext, Math.min(Math.max(count, 3), 5))

  const { text } = await generateText({
    model: client.languageModel(settings.model),
    system,
    prompt,
    temperature: settings.temperature,
  })

  // Split numbered lines like "1. ...\n2. ..."
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\d+\s*[).:-]\s*/, ''))
    .filter((l) => l.length > 0)

  return { lines }
}

