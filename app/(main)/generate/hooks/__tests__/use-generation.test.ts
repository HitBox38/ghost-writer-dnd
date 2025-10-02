import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGeneration } from "../use-generation";
import { useCharacterStore } from "@/stores/character-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useResultsStore } from "@/stores/results-store";
import { generateFlavorText } from "@/lib/ai-generator";
import { toast } from "sonner";
import type { CharacterProfile } from "@/lib/types";

// Mock stores
vi.mock("@/stores/character-store", () => ({
  useCharacterStore: vi.fn(),
}));

vi.mock("@/stores/settings-store", () => ({
  useSettingsStore: vi.fn(),
}));

vi.mock("@/stores/results-store", () => ({
  useResultsStore: vi.fn(),
}));

// Mock AI generator
vi.mock("@/lib/ai-generator", () => ({
  generateFlavorText: vi.fn(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe("useGeneration", () => {
  const mockCharacter: CharacterProfile = {
    id: "1",
    name: "Aragorn",
    race: "Human",
    class: "Ranger",
    level: 10,
    backstory: "A ranger from the north",
    appearance: "Tall and rugged",
    worldSetting: "Middle Earth",
    characterSheet: "base64string",
    favorites: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const mockGetActiveCharacter = vi.fn();
  const mockAddFavorite = vi.fn();
  const mockUpdateSettings = vi.fn();
  const mockSetResults = vi.fn();
  const mockToggleFavorite = vi.fn();
  const mockSetGenerationType = vi.fn();
  const mockSetContext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCharacterStore).mockReturnValue({
      getActiveCharacter: mockGetActiveCharacter,
      addFavorite: mockAddFavorite,
      characters: [mockCharacter],
      setActiveCharacter: vi.fn(),
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      deleteCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    vi.mocked(useSettingsStore).mockReturnValue({
      settings: {
        provider: "openai",
        model: "gpt-4",
        apiKey: "test-key",
        temperature: 0.7,
      },
      updateSettings: mockUpdateSettings,
      setApiKey: vi.fn(),
      testConnection: vi.fn(),
    });

    vi.mocked(useResultsStore).mockReturnValue({
      results: [],
      generationType: "mockery",
      context: "",
      favorites: new Set(),
      setResults: mockSetResults,
      toggleFavorite: mockToggleFavorite,
      setGenerationType: mockSetGenerationType,
      setContext: mockSetContext,
    });
  });

  it("should initialize with correct default values", () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);

    const { result } = renderHook(() => useGeneration());

    expect(result.current.results).toEqual([]);
    expect(result.current.generationType).toBe("mockery");
    expect(result.current.context).toBe("");
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.resultCount).toBe(5);
  });

  it("should handle generation successfully", async () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    const mockResults = [
      { id: "1", text: "Result 1" },
      { id: "2", text: "Result 2" },
    ];
    vi.mocked(generateFlavorText).mockResolvedValue(mockResults);

    const { result } = renderHook(() => useGeneration());

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(generateFlavorText).toHaveBeenCalledWith(
      mockCharacter,
      "mockery",
      "openai",
      "gpt-4",
      "test-key",
      0.7,
      "",
      5
    );
    expect(mockSetResults).toHaveBeenCalledWith(mockResults, "mockery", "");
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show error when no active character", async () => {
    mockGetActiveCharacter.mockReturnValue(null);

    const { result } = renderHook(() => useGeneration());

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(generateFlavorText).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Please select or create a character first");
  });

  it("should show error when no API key", async () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(useSettingsStore).mockReturnValue({
      settings: {
        provider: "openai",
        model: "gpt-4",
        apiKey: "",
        temperature: 0.7,
      },
      updateSettings: mockUpdateSettings,
      setApiKey: vi.fn(),
      testConnection: vi.fn(),
    });

    const { result } = renderHook(() => useGeneration());

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(generateFlavorText).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Please configure your API key in settings");
  });

  it("should handle generation error", async () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(generateFlavorText).mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useGeneration());

    await act(async () => {
      await result.current.handleGenerate();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("API Error");
    });
  });

  it("should toggle favorite when not favorited", () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);

    const { result } = renderHook(() => useGeneration());

    act(() => {
      result.current.handleToggleFavorite({ id: "1", text: "Test" });
    });

    expect(mockAddFavorite).toHaveBeenCalledWith("1", "Test", "mockery", "");
    expect(mockToggleFavorite).toHaveBeenCalledWith("1");
    expect(toast.success).toHaveBeenCalledWith("Added to favorites");
  });

  it("should toggle favorite when already favorited", () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(useResultsStore).mockReturnValue({
      results: [],
      generationType: "mockery",
      context: "",
      favorites: new Set(["1"]),
      setResults: mockSetResults,
      toggleFavorite: mockToggleFavorite,
      setGenerationType: mockSetGenerationType,
      setContext: mockSetContext,
    });

    const { result } = renderHook(() => useGeneration());

    act(() => {
      result.current.handleToggleFavorite({ id: "1", text: "Test" });
    });

    expect(mockAddFavorite).not.toHaveBeenCalled();
    expect(mockToggleFavorite).toHaveBeenCalledWith("1");
  });

  it("should handle copy to clipboard", () => {
    const { result } = renderHook(() => useGeneration());

    act(() => {
      result.current.handleCopy("Test text");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Test text");
    expect(toast.success).toHaveBeenCalledWith("Copied to clipboard");
  });

  it("should handle provider change", () => {
    const { result } = renderHook(() => useGeneration());

    act(() => {
      result.current.handleProviderChange("anthropic");
    });

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
    });
  });

  it("should handle Ctrl+Enter keydown", async () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    const mockResults = [{ id: "1", text: "Result" }];
    vi.mocked(generateFlavorText).mockResolvedValue(mockResults);

    const { result } = renderHook(() => useGeneration());

    const event = {
      ctrlKey: true,
      key: "Enter",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;

    await act(async () => {
      result.current.handleKeyDown(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    await waitFor(() => {
      expect(generateFlavorText).toHaveBeenCalled();
    });
  });

  it("should handle Meta+Enter keydown", async () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    const mockResults = [{ id: "1", text: "Result" }];
    vi.mocked(generateFlavorText).mockResolvedValue(mockResults);

    const { result } = renderHook(() => useGeneration());

    const event = {
      metaKey: true,
      key: "Enter",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent;

    await act(async () => {
      result.current.handleKeyDown(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    await waitFor(() => {
      expect(generateFlavorText).toHaveBeenCalled();
    });
  });

  it("should handle non-Error exception in generation", async () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(generateFlavorText).mockRejectedValue("String error");

    const { result } = renderHook(() => useGeneration());

    await act(async () => {
      await result.current.handleGenerate();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to generate text");
    });
  });

  it("should generate catchphrases success message", async () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    const mockResults = [{ id: "1", text: "Result" }];
    vi.mocked(generateFlavorText).mockResolvedValue(mockResults);
    vi.mocked(useResultsStore).mockReturnValue({
      results: [],
      generationType: "catchphrase",
      context: "",
      favorites: new Set(),
      setResults: mockSetResults,
      toggleFavorite: mockToggleFavorite,
      setGenerationType: mockSetGenerationType,
      setContext: mockSetContext,
    });

    const { result } = renderHook(() => useGeneration());

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(toast.success).toHaveBeenCalledWith("Generated 1 catchphrases");
  });

  it("should not toggle favorite when no active character", () => {
    mockGetActiveCharacter.mockReturnValue(null);

    const { result } = renderHook(() => useGeneration());

    act(() => {
      result.current.handleToggleFavorite({ id: "1", text: "Test" });
    });

    expect(mockAddFavorite).not.toHaveBeenCalled();
    expect(mockToggleFavorite).not.toHaveBeenCalled();
  });
});
