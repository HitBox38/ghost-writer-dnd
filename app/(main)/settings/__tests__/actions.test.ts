import { beforeEach, expect, it, vi } from "vitest";
import { testProviderAction } from "@/app/(main)/settings/actions";
import { listProviderModels } from "@/lib/model-catalog";
import type { AIProvider } from "@/lib/types";
vi.mock("@/lib/model-catalog", () => ({
  listProviderModels: vi.fn(),
}));
beforeEach(() => vi.clearAllMocks());
it("tests a configured provider by loading its current models", async () => {
  vi.mocked(listProviderModels).mockResolvedValue([
    {
      value: "new-model",
      label: "New model",
    },
  ]);
  expect(await testProviderAction("openai", "test-key")).toBe(true);
  expect(listProviderModels).toHaveBeenCalledWith("openai", "test-key");
});
it("does not send empty credentials or an unknown provider", async () => {
  expect(await testProviderAction("openai", "  ")).toBe(false);
  expect(await testProviderAction("invalid" as AIProvider, "key")).toBe(false);
  expect(listProviderModels).not.toHaveBeenCalled();
});
it("validates an OpenRouter key before trusting its public model catalog", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(null, {
      status: 401,
    }),
  );
  expect(await testProviderAction("openrouter", "bad-key")).toBe(false);
  expect(listProviderModels).not.toHaveBeenCalled();
  fetchMock.mockRestore();
});
