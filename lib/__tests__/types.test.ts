import { describe, it, expect } from "vitest";
import { DEFAULT_MODELS, MODEL_OPTIONS } from "../types";
import type { AIProvider } from "../types";

describe("types", () => {
  describe("DEFAULT_MODELS", () => {
    it("should have model for each provider", () => {
      const providers: AIProvider[] = ["openai", "anthropic", "google"];
      providers.forEach((provider) => {
        expect(DEFAULT_MODELS[provider]).toBeDefined();
        expect(typeof DEFAULT_MODELS[provider]).toBe("string");
      });
    });

    it("should use correct default models", () => {
      expect(DEFAULT_MODELS.openai).toBe("gpt-5");
      expect(DEFAULT_MODELS.anthropic).toBe("claude-sonnet-4-5");
      expect(DEFAULT_MODELS.google).toBe("gemini-2.5-flash");
    });
  });

  describe("MODEL_OPTIONS", () => {
    it("should have options for each provider", () => {
      const providers: AIProvider[] = ["openai", "anthropic", "google"];
      providers.forEach((provider) => {
        expect(MODEL_OPTIONS[provider]).toBeDefined();
        expect(Array.isArray(MODEL_OPTIONS[provider])).toBe(true);
        expect(MODEL_OPTIONS[provider].length).toBeGreaterThan(0);
      });
    });

    it("should have valid model option structure", () => {
      Object.values(MODEL_OPTIONS).forEach((options) => {
        options.forEach((option) => {
          expect(option).toHaveProperty("value");
          expect(option).toHaveProperty("label");
          expect(typeof option.value).toBe("string");
          expect(typeof option.label).toBe("string");
        });
      });
    });

    it("should include default model in options", () => {
      const providers: AIProvider[] = ["openai", "anthropic", "google"];
      providers.forEach((provider) => {
        const defaultModel = DEFAULT_MODELS[provider];
        const hasDefault = MODEL_OPTIONS[provider].some((opt) => opt.value === defaultModel);
        expect(hasDefault).toBe(true);
      });
    });
  });
});
