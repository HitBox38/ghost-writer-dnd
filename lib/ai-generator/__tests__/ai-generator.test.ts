import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateFlavorText,
  getAIModel,
  getReasoningOptions,
  testConnection,
} from "@/lib/ai-generator";
import type { AIProvider, CharacterProfile } from "@/lib/types";
import { createXai } from "@ai-sdk/xai";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createCohere } from "@ai-sdk/cohere";
import { createCerebras } from "@ai-sdk/cerebras";

// Mock AI SDK
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => vi.fn()),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  createAnthropic: vi.fn(() => vi.fn()),
}));

vi.mock("@ai-sdk/google", () => ({
  createGoogle: vi.fn(() => vi.fn()),
}));

vi.mock("@openrouter/ai-sdk-provider", () => ({
  createOpenRouter: vi.fn(() => vi.fn()),
}));

vi.mock("@ai-sdk/xai", () => ({ createXai: vi.fn(() => vi.fn()) }));
vi.mock("@ai-sdk/groq", () => ({ createGroq: vi.fn(() => vi.fn()) }));
vi.mock("@ai-sdk/mistral", () => ({ createMistral: vi.fn(() => vi.fn()) }));
vi.mock("@ai-sdk/deepseek", () => ({ createDeepSeek: vi.fn(() => vi.fn()) }));
vi.mock("@ai-sdk/cohere", () => ({ createCohere: vi.fn(() => vi.fn()) }));
vi.mock("@ai-sdk/cerebras", () => ({ createCerebras: vi.fn(() => vi.fn()) }));

it.each(["openai", "anthropic", "google", "xai", "groq", "deepseek"] as const)(
  "uses portable reasoning for %s",
  (provider) => expect(getReasoningOptions(provider, "medium")).toEqual({ reasoning: "medium" }),
);
it("maps reasoning to OpenRouter and Cerebras provider options", () => {
  expect(getReasoningOptions("openrouter", "low")).toEqual({
    providerOptions: { openrouter: { reasoning: { effort: "low" } } },
  });
  expect(getReasoningOptions("cerebras", "high")).toEqual({
    providerOptions: { cerebras: { reasoningEffort: "high" } },
  });
});
it("omits reasoning when it is unset or unavailable", () => {
  expect(getReasoningOptions("openai")).toEqual({});
  expect(getReasoningOptions("cohere", "high")).toEqual({});
  expect(getReasoningOptions("mistral", "medium")).toEqual({});
  expect(getReasoningOptions("mistral", "high")).toEqual({ reasoning: "high" });
  expect(getReasoningOptions("openai", "invalid" as never)).toEqual({});
});

it.each([
  ["xai", createXai],
  ["groq", createGroq],
  ["mistral", createMistral],
  ["deepseek", createDeepSeek],
  ["cohere", createCohere],
  ["cerebras", createCerebras],
] as const)("creates a %s model with its key and model ID", (provider, createProvider) => {
  const factory = vi.mocked(createProvider);
  getAIModel(provider, "current-model", "secret");
  expect(factory).toHaveBeenCalledWith({ apiKey: "secret" });
  expect(factory.mock.results[0].value).toHaveBeenCalledWith("current-model");
});

describe("ai-generator", () => {
  const mockCharacter: CharacterProfile = {
    id: "1",
    name: "Gandalf",
    class: "Wizard",
    race: "Maia",
    level: 20,
    backstory: "A powerful wizard",
    appearance: "Grey robes and staff",
    worldSetting: "Middle Earth",
    favorites: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateFlavorText", () => {
    it("should throw error when API key is missing", async () => {
      await expect(
        generateFlavorText(mockCharacter, "mockery", "openai", "gpt-4o", "", 0.8),
      ).rejects.toThrow("API key is required");
    });

    it("should generate mockery text", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockResolvedValue({
        text: "- Mocking quip 1\n- Mocking quip 2\n- Mocking quip 3",
      });

      const results = await generateFlavorText(
        mockCharacter,
        "mockery",
        "openai",
        "gpt-4o",
        "test-key",
        0.8,
        "against a noble",
        3,
      );

      expect(results).toHaveLength(3);
      expect(results[0].text).toBe("Mocking quip 1");
      expect(results[0].id).toBeDefined();
    });

    it("should generate catchphrase text", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockResolvedValue({
        text: "- Catchphrase 1\n- Catchphrase 2",
      });

      const results = await generateFlavorText(
        mockCharacter,
        "catchphrase",
        "anthropic",
        "claude-3-5-sonnet-20241022",
        "test-key",
        0.7,
      );

      expect(results).toHaveLength(2);
    });

    it("should handle API errors gracefully", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockRejectedValue(new Error("API key invalid"));

      await expect(
        generateFlavorText(mockCharacter, "mockery", "openai", "gpt-4o", "bad-key", 0.8),
      ).rejects.toThrow("Invalid API key");
    });
  });

  describe("testConnection", () => {
    it("should return true for successful connection", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockResolvedValue({
        text: "OK",
      });

      const result = await testConnection("openai", "gpt-4o", "test-key");
      expect(result).toBe(true);
    });

    it("should return false for failed connection", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockRejectedValue(new Error("Connection failed"));

      const result = await testConnection("openai", "gpt-4o", "bad-key");
      expect(result).toBe(false);
    });
  });

  describe("provider support", () => {
    it("should work with Google provider", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockResolvedValue({
        text: "- Google quip 1\n- Google quip 2",
      });

      const results = await generateFlavorText(
        mockCharacter,
        "mockery",
        "google",
        "gemini-pro",
        "test-key",
        0.8,
      );

      expect(results).toHaveLength(2);
    });

    it("should work with Anthropic provider", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockResolvedValue({
        text: "- Anthropic quip 1",
      });

      const results = await generateFlavorText(
        mockCharacter,
        "mockery",
        "anthropic",
        "claude-3-5-sonnet-20241022",
        "test-key",
        0.8,
      );

      expect(results).toHaveLength(1);
    });

    it("should work with OpenRouter provider", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockResolvedValue({
        text: "- OpenRouter quip 1\n- OpenRouter quip 2",
      });

      const results = await generateFlavorText(
        mockCharacter,
        "mockery",
        "openrouter",
        "openai/gpt-4o",
        "test-key",
        0.8,
      );

      expect(results).toHaveLength(2);
    });
  });

  describe("PDF support", () => {
    it("should include PDF in messages when character has character sheet", async () => {
      const { generateText } = await import("ai");
      const mockGenerateText = vi.mocked(generateText, { partial: true });
      mockGenerateText.mockResolvedValue({
        text: "- PDF-aware quip 1\n- PDF-aware quip 2",
      });

      const characterWithPDF = {
        ...mockCharacter,
        characterSheet: "base64encodedpdfstring",
      };

      await generateFlavorText(
        characterWithPDF,
        "mockery",
        "google",
        "gemini-pro",
        "test-key",
        0.8,
      );

      expect(mockGenerateText).toHaveBeenCalled();
      const callArgs = mockGenerateText.mock.calls[0][0];
      expect(callArgs).toHaveProperty("messages");
      expect(callArgs.messages).toBeDefined();
      expect(callArgs.messages?.[0]?.content).toHaveLength(2); // Text + PDF
    });

    it("should not include PDF when character has no character sheet", async () => {
      const { generateText } = await import("ai");
      const mockGenerateText = vi.mocked(generateText, { partial: true });
      mockGenerateText.mockResolvedValue({
        text: "- Normal quip 1\n- Normal quip 2",
      });

      await generateFlavorText(mockCharacter, "mockery", "google", "gemini-pro", "test-key", 0.8);

      expect(mockGenerateText).toHaveBeenCalled();
      const callArgs = mockGenerateText.mock.calls[0][0];
      expect(callArgs).toHaveProperty("messages");
      expect(callArgs.messages).toBeDefined();
      expect(callArgs.messages?.[0]?.content).toHaveLength(1); // Text only
    });
  });

  describe("error handling", () => {
    it("should handle unknown provider", async () => {
      await expect(
        generateFlavorText(
          mockCharacter,
          "mockery",
          "unknown" as AIProvider,
          "model",
          "test-key",
          0.8,
        ),
      ).rejects.toThrow("Unknown provider");
    });

    it("should handle rate limit errors", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockRejectedValue(
        new Error("rate limit exceeded"),
      );

      await expect(
        generateFlavorText(mockCharacter, "mockery", "openai", "gpt-4o", "test-key", 0.8),
      ).rejects.toThrow("Rate limit reached");
    });

    it("should handle empty results", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockResolvedValue({
        text: "No dashes in this response",
      });

      await expect(
        generateFlavorText(mockCharacter, "mockery", "openai", "gpt-4o", "test-key", 0.8),
      ).rejects.toThrow("No valid results generated");
    });

    it("should handle generic errors", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockRejectedValue(new Error("Some other error"));

      await expect(
        generateFlavorText(mockCharacter, "mockery", "openai", "gpt-4o", "test-key", 0.8),
      ).rejects.toThrow("Some other error");
    });

    it("should handle non-Error exceptions", async () => {
      const { generateText } = await import("ai");
      vi.mocked(generateText, { partial: true }).mockRejectedValue("string error");

      await expect(
        generateFlavorText(mockCharacter, "mockery", "openai", "gpt-4o", "test-key", 0.8),
      ).rejects.toThrow("Failed to generate text");
    });
  });
});
