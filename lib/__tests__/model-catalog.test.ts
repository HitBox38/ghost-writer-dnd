import { beforeEach, expect, it, vi } from "vitest";
import { listProviderModels } from "../model-catalog";

const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

function page(body: unknown) {
  return Response.json(body);
}

it("loads live OpenAI IDs using the supplied key", async () => {
  fetchMock.mockResolvedValue(
    page({
      data: [
        { id: "gpt-5" },
        { id: "o3" },
        { id: "gpt-image-1" },
        { id: "text-embedding-3-large" },
      ],
    }),
  );
  expect(await listProviderModels("openai", "secret")).toEqual([
    { value: "gpt-5", label: "gpt-5" },
    { value: "o3", label: "o3" },
  ]);
  expect(fetchMock).toHaveBeenCalledWith(
    new URL("https://api.openai.com/v1/models"),
    expect.objectContaining({ headers: { Authorization: "Bearer secret" }, cache: "no-store" }),
  );
});

it("follows Anthropic pages and preserves display names", async () => {
  fetchMock
    .mockResolvedValueOnce(
      page({
        data: [{ id: "claude-new", display_name: "New Claude" }],
        has_more: true,
        last_id: "claude-new",
      }),
    )
    .mockResolvedValueOnce(
      page({ data: [{ id: "claude-old", display_name: "Old Claude" }], has_more: false }),
    );
  expect(await listProviderModels("anthropic", "secret")).toEqual([
    { value: "claude-new", label: "New Claude" },
    { value: "claude-old", label: "Old Claude" },
  ]);
  expect((fetchMock.mock.calls[1][0] as URL).searchParams.get("after_id")).toBe("claude-new");
});

it("keeps only Google models that can generate content", async () => {
  fetchMock.mockResolvedValue(
    page({
      models: [
        {
          name: "models/gemini-new",
          displayName: "Gemini New",
          supportedGenerationMethods: ["generateContent"],
        },
        { name: "models/embed-new", supportedGenerationMethods: ["embedContent"] },
        { name: "models/gemini-image-preview", supportedGenerationMethods: ["generateContent"] },
      ],
    }),
  );
  expect(await listProviderModels("google", "secret")).toEqual([
    { value: "gemini-new", label: "Gemini New" },
  ]);
});

it("keeps only OpenRouter text input and output models", async () => {
  fetchMock.mockResolvedValue(
    page({
      data: [
        {
          id: "author/text-and-file",
          name: "Text and file model",
          architecture: { input_modalities: ["text", "file"], output_modalities: ["text"] },
        },
        {
          id: "author/text-only",
          name: "Text only model",
          architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        },
        {
          id: "author/image",
          name: "Image model",
          architecture: { input_modalities: ["text"], output_modalities: ["image"] },
        },
      ],
    }),
  );
  expect(await listProviderModels("openrouter", "secret")).toEqual([
    { value: "author/text-and-file", label: "Text and file model" },
    { value: "author/text-only", label: "Text only model" },
  ]);
});

it("loads xAI language models and excludes non-text output", async () => {
  fetchMock.mockResolvedValue(
    page({
      models: [
        { id: "grok-text", output_modalities: ["text"] },
        { id: "grok-image", output_modalities: ["image"] },
      ],
    }),
  );
  expect(await listProviderModels("xai", "secret")).toEqual([
    { value: "grok-text", label: "grok-text" },
  ]);
  expect((fetchMock.mock.calls[0][0] as URL).toString()).toBe(
    "https://api.x.ai/v1/language-models",
  );
});

it.each([
  [
    "groq",
    "https://api.groq.com/openai/v1/models",
    {
      data: [
        { id: "groq-chat", active: true },
        { id: "retired", active: false },
      ],
    },
  ],
  [
    "deepseek",
    "https://api.deepseek.com/models",
    {
      data: [
        { id: "deepseek-chat", output_modalities: ["text"] },
        { id: "image", output_modalities: ["image"] },
      ],
    },
  ],
  ["cerebras", "https://api.cerebras.ai/v1/models", { data: [{ id: "cerebras-chat" }] }],
] as const)("loads %s models with the provider key", async (provider, endpoint, body) => {
  fetchMock.mockResolvedValue(page(body));
  const models = await listProviderModels(provider, "secret");
  expect(models).toHaveLength(1);
  expect((fetchMock.mock.calls[0][0] as URL).toString()).toBe(endpoint);
  expect(fetchMock.mock.calls[0][1]).toEqual(
    expect.objectContaining({
      headers: { Authorization: "Bearer secret" },
    }),
  );
});

it("keeps available Mistral chat models", async () => {
  fetchMock.mockResolvedValue(
    page({
      data: [
        { id: "mistral-chat", capabilities: { completion_chat: true } },
        { id: "mistral-embedding", capabilities: { completion_chat: false } },
        { id: "mistral-retired", archived: true },
      ],
    }),
  );
  expect(await listProviderModels("mistral", "secret")).toEqual([
    { value: "mistral-chat", label: "mistral-chat" },
  ]);
});

it("loads every page of Cohere chat models and skips deprecated models", async () => {
  fetchMock
    .mockResolvedValueOnce(page({ models: [{ name: "command-a" }], next_page_token: "next" }))
    .mockResolvedValueOnce(
      page({ models: [{ name: "command-b" }, { name: "old", is_deprecated: true }] }),
    );
  expect(await listProviderModels("cohere", "secret")).toEqual([
    { value: "command-a", label: "command-a" },
    { value: "command-b", label: "command-b" },
  ]);
  expect((fetchMock.mock.calls[0][0] as URL).searchParams.get("endpoint")).toBe("chat");
  expect((fetchMock.mock.calls[1][0] as URL).searchParams.get("page_token")).toBe("next");
});

it.each([
  [
    "openai",
    { data: [{ id: "gpt-5" }, { id: "gpt-3.5-turbo" }, { id: "gpt-image-1" }] },
    ["gpt-5"],
  ],
  ["anthropic", { data: [{ id: "claude-4-sonnet" }, { id: "claude-2" }] }, ["claude-4-sonnet"]],
  [
    "google",
    {
      models: [
        { name: "models/gemini-3-flash", supportedGenerationMethods: ["generateContent"] },
        { name: "models/gemini-3-flash-image", supportedGenerationMethods: ["generateContent"] },
      ],
    },
    ["gemini-3-flash"],
  ],
  [
    "openrouter",
    {
      data: [
        {
          id: "vendor/with-file",
          architecture: { input_modalities: ["text", "file"], output_modalities: ["text"] },
        },
        {
          id: "vendor/text-only",
          architecture: { input_modalities: ["text"], output_modalities: ["text"] },
        },
        {
          id: "vendor/image-output",
          architecture: { input_modalities: ["text", "file"], output_modalities: ["image"] },
        },
      ],
    },
    ["vendor/with-file"],
  ],
  [
    "mistral",
    {
      data: [
        { id: "mistral-vision", capabilities: { completion_chat: true, vision: true } },
        { id: "mistral-text", capabilities: { completion_chat: true, vision: false } },
      ],
    },
    ["mistral-vision"],
  ],
] as const)(
  "shows only inline PDF-capable %s text models when a sheet is attached",
  async (provider, body, expectedIds) => {
    fetchMock.mockResolvedValue(page(body));
    expect((await listProviderModels(provider, "secret", true)).map(({ value }) => value)).toEqual(
      expectedIds,
    );
  },
);

it.each([
  ["xai", { models: [{ id: "grok-4", input_modalities: ["text"], output_modalities: ["text"] }] }],
  ["groq", { data: [{ id: "llama-3.3-70b-versatile" }] }],
  ["deepseek", { data: [{ id: "deepseek-chat", output_modalities: ["text"] }] }],
  ["cohere", { models: [{ name: "command-a" }] }],
  ["cerebras", { data: [{ id: "llama-3.3-70b" }] }],
] as const)("does not offer %s models for the app's inline PDF format", async (provider, body) => {
  fetchMock.mockResolvedValue(page(body));
  expect(await listProviderModels(provider, "secret", true)).toEqual([]);
});

it("excludes speech and safety models from Groq text generation", async () => {
  fetchMock.mockResolvedValue(
    page({
      data: [
        { id: "llama-3.3-70b-versatile" },
        { id: "whisper-large-v3" },
        { id: "canopylabs/orpheus-v1-english" },
        { id: "meta-llama/llama-prompt-guard-2-86m" },
      ],
    }),
  );
  expect((await listProviderModels("groq", "secret")).map(({ value }) => value)).toEqual([
    "llama-3.3-70b-versatile",
  ]);
});
