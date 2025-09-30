import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
// Optional providers loaded conditionally to keep bundle lean if not used
let createAnthropicFn: any = null
let createGoogleFn: any = null

import type { CharacterProfile, GenerationMode, Settings } from '@/lib/types'

type GenerateArgs = {
  profile: CharacterProfile
  settings: Settings
  mode: GenerationMode
  userContext: string
  count?: number
}

const loadAnthropic = async () => {
  if (createAnthropicFn) return createAnthropicFn
  try {
    const mod = await import('@ai-sdk/anthropic')
    createAnthropicFn = (mod as any).createAnthropic
  } catch {
    createAnthropicFn = null
  }
  return createAnthropicFn
}

const loadGoogle = async () => {
  if (createGoogleFn) return createGoogleFn
  try {
    const mod = await import('@ai-sdk/google')
    createGoogleFn = (mod as any).createGoogleGenerativeAI
  } catch {
    createGoogleFn = null
  }
  return createGoogleFn
}

export const buildSystemPrompt = (profile: CharacterProfile, mode: GenerationMode): string => {
  const persona = [
    `You are roleplaying as ${profile.name}, a level ${profile.level} ${profile.race} ${profile.class}.`,
    `Backstory: ${profile.backstory || 'N/A'}.`,
    `Appearance: ${profile.appearance || 'N/A'}.`,
    `World/Campaign Setting: ${profile.worldSetting || 'N/A'}.`,
    mode === 'mockery'
      ? 'Task: Generate scathing, witty, D&D-appropriate Vicious Mockery-style insults. Use fantasy vernacular. Avoid profanity.'
      : 'Task: Generate concise, memorable character catchphrases that reflect the persona and world.',
    'Tone: Match the character personality based on the context above. Keep each line punchy (≤ 18 words).',
    'Output: Return exactly the requested number of distinct lines, one per line, no numbering, no quotes, no extra commentary.',
  ]
  return persona.join('\n')
}

export const generateFlavorText = async ({ profile, settings, mode, userContext, count = 5 }: GenerateArgs): Promise<string[]> => {
  const system = buildSystemPrompt(profile, mode)
  const context = userContext?.trim() ? `Additional context: ${userContext.trim()}` : ''

  const provider = settings.provider
  const modelName = settings.model
  const temperature = settings.temperature ?? 0.7
  const apiKey = settings.apiKey

  let modelFactory: any
  if (provider === 'openai') {
    modelFactory = createOpenAI({ apiKey })
  } else if (provider === 'anthropic') {
    const createAnthropic = await loadAnthropic()
    if (!createAnthropic) throw new Error('Anthropic provider not available')
    modelFactory = createAnthropic({ apiKey })
  } else if (provider === 'google') {
    const createGoogleGenerativeAI = await loadGoogle()
    if (!createGoogleGenerativeAI) throw new Error('Google provider not available')
    modelFactory = createGoogleGenerativeAI({ apiKey })
  } else {
    throw new Error('Unsupported provider')
  }

  const requestPrompt = [`Generate ${count} ${mode === 'mockery' ? 'insults' : 'catchphrases'} for this character.`, context].filter(Boolean).join('\n')

  const result = await generateText({
    model: modelFactory(modelName),
    system,
    prompt: requestPrompt,
    temperature,
  })

  const lines: string[] = result.text
    .split('\n')
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0 && !/^(\d+\.|[-*])\s?/.test(l))

  if (lines.length >= count) return lines.slice(0, count)

  // Fallback: attempt to split by bullets or punctuation
  const more: string[] = result.text
    .split(/\n+|•|;|—|–/)
    .map((l: string) => l.trim())
    .filter((s: string) => !!s)

  return Array.from(new Set<string>(more)).slice(0, count)
}

export const testConnection = async (settings: Settings): Promise<{ ok: boolean; error?: string }> => {
  try {
    await generateFlavorText({
      profile: {
        id: 'test',
        name: 'Test Bard',
        class: 'Bard',
        race: 'Half-elf',
        level: 3,
        backstory: '',
        appearance: '',
        worldSetting: '',
        favorites: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      settings,
      mode: 'catchphrase',
      userContext: 'Short two-word motto',
      count: 1,
    })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Unknown error' }
  }
}

