import { beforeEach, expect, it, vi } from "vitest";
import { generateText } from "ai";
import { generateFlavorTextAction } from "@/app/(main)/generate/actions";
import { characterFixture, quipFixtures } from "@/tests/fixtures/characters";
import { getAIModel, buildPrompt, parseResults, getReasoningOptions } from "@/lib/ai-generator";
import { listProviderModels } from "@/lib/model-catalog";
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));
vi.mock("@/lib/ai-generator", () => ({
  getAIModel: vi.fn(() => "model"),
  buildPrompt: vi.fn(() => []),
  parseResults: vi.fn(),
  getReasoningOptions: vi.fn(() => ({})),
}));
vi.mock("@/lib/model-catalog", () => ({
  listProviderModels: vi.fn(),
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listProviderModels).mockResolvedValue([
    {
      value: "gpt-5",
      label: "gpt-5",
    },
  ]);
  vi.mocked(generateText).mockResolvedValue({
    text: "lines",
  } as never);
  vi.mocked(parseResults).mockReturnValue(quipFixtures);
});
const call = (character = characterFixture, key = "test-key") =>
  generateFlavorTextAction(character, "mockery", "openai", "gpt-5", key, 0.8, "A duel", 12);
it("passes the character, model, scene and count to generation", async () => {
  expect(await call()).toHaveLength(12);
  expect(getAIModel).toHaveBeenCalledWith("openai", "gpt-5", "test-key");
  expect(buildPrompt).toHaveBeenCalledWith(characterFixture, "mockery", 12, "A duel");
});
it("passes the selected reasoning effort to the model request", async () => {
  vi.mocked(getReasoningOptions).mockReturnValueOnce({
    reasoning: "high",
  });
  await generateFlavorTextAction(
    characterFixture,
    "mockery",
    "openai",
    "gpt-5",
    "test-key",
    0.8,
    "A duel",
    12,
    "high",
  );
  expect(getReasoningOptions).toHaveBeenCalledWith("openai", "high");
  expect(generateText).toHaveBeenCalledWith(
    expect.objectContaining({
      reasoning: "high",
    }),
  );
});
it("rejects missing credentials and empty output", async () => {
  await expect(call(characterFixture, "")).rejects.toThrow("API key is required");
  vi.mocked(parseResults).mockReturnValue([]);
  await expect(call()).rejects.toThrow("No valid results");
});
it("reports a PDF failure without silently ignoring the attachment", async () => {
  vi.mocked(generateText).mockRejectedValueOnce(new Error("PDF not supported"));
  await expect(
    call({
      ...characterFixture,
      characterSheet: "data:application/pdf;base64,AAAA",
    }),
  ).rejects.toThrow("PDF not supported");
  expect(generateText).toHaveBeenCalledTimes(1);
  expect(listProviderModels).toHaveBeenCalledWith("openai", "test-key", true);
});
it("rejects a stale model selection when a PDF is attached", async () => {
  vi.mocked(listProviderModels).mockResolvedValueOnce([]);
  await expect(
    call({
      ...characterFixture,
      characterSheet: "data:application/pdf;base64,AAAA",
    }),
  ).rejects.toThrow("Choose a PDF-compatible model");
  expect(generateText).not.toHaveBeenCalled();
});
it.each([
  ["Invalid API key", "Invalid API key"],
  ["rate limit reached", "Rate limit reached"],
  ["Network unavailable", "Network unavailable"],
  [null, "Failed to generate text"],
])("returns a useful failure for %s", async (problem, expected) => {
  vi.mocked(generateText).mockRejectedValueOnce(problem === null ? null : new Error(problem));
  await expect(call()).rejects.toThrow(expected);
});
