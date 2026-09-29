import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useGeneration } from "../use-generation";
import { useCharacterStore } from "@/stores/character-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { generateFlavorTextAction } from "../../actions";
import { characterFixture, quipFixtures } from "@/tests/fixtures/characters";
import { toast } from "sonner";
import { emptyApiKeys } from "@/lib/types";

vi.mock("../../actions", () => ({ generateFlavorTextAction: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
  useCharacterStore.setState({
    initialized: true,
    characters: [{ ...characterFixture, favorites: [] }],
    activeCharacterId: characterFixture.id,
  });
  useWorkspaceStore.getState().reset();
  useSettingsStore.setState({
    settings: {
      provider: "openai",
      apiKey: "test-key",
      apiKeys: { ...emptyApiKeys(), openai: "test-key", anthropic: "second-key" },
      model: "gpt-5",
      temperature: 0.8,
      theme: "light",
    },
  });
  vi.mocked(generateFlavorTextAction).mockResolvedValue(quipFixtures);
});

describe("writing sessions", () => {
  it.each(["success", "failure"])(
    "ignores a late %s after replacing workspace data",
    async (outcome) => {
      let resolve!: (value: typeof quipFixtures) => void;
      let reject!: (error: Error) => void;
      vi.mocked(generateFlavorTextAction).mockImplementationOnce(
        () =>
          new Promise((done, fail) => {
            resolve = done;
            reject = fail;
          }),
      );
      const { result } = renderHook(useGeneration);
      let request!: Promise<void>;
      act(() => {
        request = result.current.handleGenerate();
      });
      act(() => {
        useWorkspaceStore.getState().reset();
        useCharacterStore.setState({
          characters: [{ ...characterFixture, name: "Restored character" }],
        });
        result.current.setContext("Restored session");
      });
      await act(async () => {
        if (outcome === "success") resolve(quipFixtures);
        else reject(new Error("Old request failed"));
        await request;
      });
      expect(result.current.context).toBe("Restored session");
      expect(result.current.results).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.isGenerating).toBe(false);
      if (outcome === "failure") expect(toast.error).not.toHaveBeenCalled();
    },
  );

  it("starts only one request when generation is triggered twice before rendering", async () => {
    const { result } = renderHook(useGeneration);
    await act(async () => {
      await Promise.all([result.current.handleGenerate(), result.current.handleGenerate()]);
    });
    expect(generateFlavorTextAction).toHaveBeenCalledTimes(1);
  });

  it("generates with the scene and count, then saves and genuinely unsaves a line", async () => {
    const { result } = renderHook(useGeneration);
    act(() => {
      result.current.setContext("At the tavern");
      result.current.setResultCount(12);
    });
    await act(async () => {
      await result.current.handleGenerate();
    });
    expect(generateFlavorTextAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: "merrin" }),
      "mockery",
      "openai",
      "gpt-5",
      "test-key",
      0.8,
      "At the tavern",
      12,
      "provider-default",
    );
    expect(result.current.results).toHaveLength(12);
    act(() => result.current.handleToggleFavorite(quipFixtures[0]));
    expect(useCharacterStore.getState().characters[0].favorites).toHaveLength(1);
    expect(result.current.favorites.has(quipFixtures[0].id)).toBe(true);
    act(() => result.current.handleToggleFavorite(quipFixtures[0]));
    expect(useCharacterStore.getState().characters[0].favorites).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem("dnd-flavor-characters")!)[0].favorites).toHaveLength(0);
  });

  it("keeps generated metadata when the next draft changes", async () => {
    const { result } = renderHook(useGeneration);
    act(() => result.current.setContext("Original scene"));
    await act(async () => {
      await result.current.handleGenerate();
    });
    act(() => {
      result.current.setContext("New scene");
      result.current.setGenerationType("catchphrase");
    });
    act(() => result.current.handleToggleFavorite(quipFixtures[0]));
    expect(useCharacterStore.getState().characters[0].favorites[0]).toMatchObject({
      type: "mockery",
      context: "Original scene",
    });
  });

  it("preserves drafts across navigation and keeps characters separate", () => {
    const first = renderHook(useGeneration);
    act(() => first.result.current.setContext("Merrin's scene"));
    first.unmount();
    const second = renderHook(useGeneration);
    expect(second.result.current.context).toBe("Merrin's scene");
    act(() =>
      useCharacterStore.getState().addCharacter({ ...characterFixture, name: "Another character" }),
    );
    expect(second.result.current.context).toBe("");
    act(() => second.result.current.setContext("Other scene"));
    act(() => useCharacterStore.getState().setActiveCharacter(characterFixture.id));
    expect(second.result.current.context).toBe("Merrin's scene");
  });

  it("routes a pending response to the original character after switching", async () => {
    let resolve!: (value: typeof quipFixtures) => void;
    vi.mocked(generateFlavorTextAction).mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const { result } = renderHook(useGeneration);
    let request!: Promise<void>;
    act(() => {
      request = result.current.handleGenerate();
    });
    act(() => useCharacterStore.getState().addCharacter({ ...characterFixture, name: "Other" }));
    await act(async () => {
      resolve(quipFixtures);
      await request;
    });
    expect(result.current.results).toHaveLength(0);
    act(() => useCharacterStore.getState().setActiveCharacter(characterFixture.id));
    expect(result.current.results).toHaveLength(12);
    expect(result.current.isGenerating).toBe(false);
  });

  it("retains old results and draft on provider failure", async () => {
    const { result } = renderHook(useGeneration);
    await act(async () => {
      await result.current.handleGenerate();
    });
    vi.mocked(generateFlavorTextAction).mockRejectedValueOnce(new Error("Rate limit reached"));
    act(() => result.current.setContext("Keep this scene"));
    await act(async () => {
      await result.current.handleGenerate();
    });
    expect(result.current.error).toBe("Rate limit reached");
    expect(toast.error).toHaveBeenCalledWith("Rate limit reached");
    expect(result.current.context).toBe("Keep this scene");
    expect(result.current.results).toHaveLength(12);
    expect(result.current.isGenerating).toBe(false);
  });

  it("switches the active key with its provider", () => {
    const { result } = renderHook(useGeneration);
    act(() => result.current.handleProviderChange("anthropic"));
    expect(result.current.settings.apiKey).toBe("second-key");
    expect(result.current.settings.model).toBe("");
  });

  it("does not call the provider with invalid counts or missing keys", async () => {
    const { result } = renderHook(useGeneration);
    for (const count of [0, 26, NaN, 1.5]) {
      act(() => result.current.setResultCount(count));
      await act(async () => {
        await result.current.handleGenerate();
      });
    }
    act(() => {
      result.current.setResultCount(5);
      useSettingsStore.getState().setApiKey("");
    });
    await act(async () => {
      await result.current.handleGenerate();
    });
    expect(generateFlavorTextAction).not.toHaveBeenCalled();
  });
});
