import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateFlavorText, testConnection } from '../ai-generator';
import type { CharacterProfile } from '../types';

// Mock AI SDK
vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: vi.fn(() => vi.fn()),
}));

vi.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: vi.fn(() => vi.fn()),
}));

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn()),
}));

describe('ai-generator', () => {
  const mockCharacter: CharacterProfile = {
    id: '1',
    name: 'Gandalf',
    class: 'Wizard',
    race: 'Maia',
    level: 20,
    backstory: 'A powerful wizard',
    appearance: 'Grey robes and staff',
    worldSetting: 'Middle Earth',
    favorites: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateFlavorText', () => {
    it('should throw error when API key is missing', async () => {
      await expect(
        generateFlavorText(mockCharacter, 'mockery', 'openai', 'gpt-4o', '', 0.8)
      ).rejects.toThrow('API key is required');
    });

    it('should generate mockery text', async () => {
      const { generateText } = await import('ai');
      vi.mocked(generateText).mockResolvedValue({
        text: '- Mocking quip 1\n- Mocking quip 2\n- Mocking quip 3',
        finishReason: 'stop',
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        warnings: [],
        request: {} as any,
        response: {} as any,
        experimental_providerMetadata: {},
        rawResponse: {} as any,
      } as any);

      const results = await generateFlavorText(
        mockCharacter,
        'mockery',
        'openai',
        'gpt-4o',
        'test-key',
        0.8,
        'against a noble',
        3
      );

      expect(results).toHaveLength(3);
      expect(results[0].text).toBe('Mocking quip 1');
      expect(results[0].id).toBeDefined();
    });

    it('should generate catchphrase text', async () => {
      const { generateText } = await import('ai');
      vi.mocked(generateText).mockResolvedValue({
        text: '- Catchphrase 1\n- Catchphrase 2',
        finishReason: 'stop',
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        warnings: [],
        request: {} as any,
        response: {} as any,
        experimental_providerMetadata: {},
        rawResponse: {} as any,
      } as any);

      const results = await generateFlavorText(
        mockCharacter,
        'catchphrase',
        'anthropic',
        'claude-3-5-sonnet-20241022',
        'test-key',
        0.7
      );

      expect(results).toHaveLength(2);
    });

    it('should handle API errors gracefully', async () => {
      const { generateText } = await import('ai');
      vi.mocked(generateText).mockRejectedValue(new Error('API key invalid'));

      await expect(
        generateFlavorText(mockCharacter, 'mockery', 'openai', 'gpt-4o', 'bad-key', 0.8)
      ).rejects.toThrow('Invalid API key');
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      const { generateText } = await import('ai');
      vi.mocked(generateText).mockResolvedValue({
        text: 'OK',
      } as any);

      const result = await testConnection('openai', 'gpt-4o', 'test-key');
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      const { generateText } = await import('ai');
      vi.mocked(generateText).mockRejectedValue(new Error('Connection failed'));

      const result = await testConnection('openai', 'gpt-4o', 'bad-key');
      expect(result).toBe(false);
    });
  });
});
