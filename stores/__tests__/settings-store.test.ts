import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSettingsStore } from "../settings-store";
import { DEFAULT_MODELS } from "@/lib/types";

describe("useSettingsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({
      settings: {
        provider: "openai",
        apiKey: "",
        apiKeys: { openai: "", anthropic: "", google: "" },
        model: DEFAULT_MODELS.openai,
        temperature: 0.8,
        theme: "system",
      },
    });

    // Mock matchMedia for theme tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("should update settings", () => {
    const { updateSettings } = useSettingsStore.getState();
    updateSettings({ temperature: 0.5 });

    expect(useSettingsStore.getState().settings.temperature).toBe(0.5);
  });

  it("should set provider and update model", () => {
    const { setProvider } = useSettingsStore.getState();
    setProvider("anthropic");

    const state = useSettingsStore.getState();
    expect(state.settings.provider).toBe("anthropic");
    expect(state.settings.model).toBe(DEFAULT_MODELS.anthropic);
  });

  it("should set API key for current provider", () => {
    const { setApiKey } = useSettingsStore.getState();
    setApiKey("test-key");

    const state = useSettingsStore.getState();
    expect(state.settings.apiKey).toBe("test-key");
    expect(state.settings.apiKeys.openai).toBe("test-key");
  });

  it("should switch provider and load correct API key", () => {
    const { updateSettings, setProvider } = useSettingsStore.getState();

    // Set OpenAI key
    updateSettings({
      apiKeys: { openai: "openai-key", anthropic: "anthropic-key", google: "" },
    });

    // Switch to Anthropic
    setProvider("anthropic");

    const state = useSettingsStore.getState();
    expect(state.settings.provider).toBe("anthropic");
    expect(state.settings.apiKey).toBe("anthropic-key");
  });

  it("should check if configured", () => {
    const { isConfigured, updateSettings } = useSettingsStore.getState();

    expect(isConfigured()).toBe(false);

    updateSettings({ apiKey: "test-key" });

    expect(isConfigured()).toBe(true);
  });

  it("should load settings from localStorage", () => {
    const mockSettings = {
      provider: "anthropic" as const,
      apiKey: "test-key",
      apiKeys: { openai: "", anthropic: "test-key", google: "" },
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.9,
      theme: "dark" as const,
    };

    localStorage.setItem("dnd-flavor-settings", JSON.stringify(mockSettings));

    const { loadSettings } = useSettingsStore.getState();
    loadSettings();

    expect(useSettingsStore.getState().settings.provider).toBe("anthropic");
    expect(useSettingsStore.getState().settings.apiKey).toBe("test-key");
  });

  it("should migrate old settings format", () => {
    const oldSettings = {
      provider: "openai" as const,
      apiKey: "old-key",
      model: "gpt-4o",
      temperature: 0.7,
      theme: "light" as const,
    };

    localStorage.setItem("dnd-flavor-settings", JSON.stringify(oldSettings));

    const { loadSettings } = useSettingsStore.getState();
    loadSettings();

    const state = useSettingsStore.getState();
    expect(state.settings.apiKeys).toBeDefined();
    expect(state.settings.apiKeys).toHaveProperty("openai");
    expect(state.settings.apiKeys).toHaveProperty("anthropic");
    expect(state.settings.apiKeys).toHaveProperty("google");
    // The migration logic creates apiKeys from old apiKey
    expect(state.settings.apiKey).toBe("old-key");
  });

  it("should set model", () => {
    const { setModel } = useSettingsStore.getState();
    setModel("gpt-4");

    expect(useSettingsStore.getState().settings.model).toBe("gpt-4");
  });

  it("should set temperature", () => {
    const { setTemperature } = useSettingsStore.getState();
    setTemperature(0.9);

    expect(useSettingsStore.getState().settings.temperature).toBe(0.9);
  });

  it("should set theme to light", () => {
    const { setTheme } = useSettingsStore.getState();
    setTheme("light");

    expect(useSettingsStore.getState().settings.theme).toBe("light");
  });

  it("should set theme to dark", () => {
    const { setTheme } = useSettingsStore.getState();
    setTheme("dark");

    expect(useSettingsStore.getState().settings.theme).toBe("dark");
  });

  it("should set theme to system", () => {
    const { setTheme } = useSettingsStore.getState();
    setTheme("system");

    expect(useSettingsStore.getState().settings.theme).toBe("system");
  });

  it("should export data", () => {
    const { exportData } = useSettingsStore.getState();

    const mockClick = vi.fn();
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    const mockAnchor = { href: "", download: "", click: mockClick };

    vi.spyOn(document, "createElement").mockReturnValue(mockAnchor as unknown as HTMLElement);
    vi.spyOn(document.body, "appendChild").mockImplementation(mockAppendChild);
    vi.spyOn(document.body, "removeChild").mockImplementation(mockRemoveChild);
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:test");
    global.URL.revokeObjectURL = vi.fn();

    exportData();

    expect(mockClick).toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("should import data", async () => {
    const mockData = {
      characters: [
        {
          id: "1",
          name: "Test Character",
          race: "Elf",
          class: "Wizard",
          level: 5,
          backstory: "",
          appearance: "",
          worldSetting: "",
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      favorites: [],
      settings: {
        provider: "anthropic" as const,
        apiKey: "imported-key",
        apiKeys: { openai: "", anthropic: "imported-key", google: "" },
        model: "claude-3-5-sonnet-20241022",
        temperature: 0.7,
        theme: "dark" as const,
      },
    };

    const mockFile = {
      text: vi.fn().mockResolvedValue(JSON.stringify(mockData)),
      name: "backup.json",
      type: "application/json",
    } as unknown as File;

    const { importData } = useSettingsStore.getState();
    await importData(mockFile);

    const state = useSettingsStore.getState();
    expect(state.settings.provider).toBe("anthropic");
    expect(state.settings.apiKey).toBe("imported-key");
  });

  it("should handle import error", async () => {
    const mockFile = {
      text: vi.fn().mockResolvedValue("invalid json"),
      name: "backup.json",
      type: "application/json",
    } as unknown as File;

    const { importData } = useSettingsStore.getState();

    await expect(importData(mockFile)).rejects.toThrow();
  });

  it("should clear all data", async () => {
    const { clearAllData, updateSettings } = useSettingsStore.getState();

    // Set some data
    updateSettings({ apiKey: "test-key", temperature: 0.9 });

    await clearAllData();

    const state = useSettingsStore.getState();
    expect(state.settings.apiKey).toBe("");
    expect(state.settings.temperature).toBe(0.8);
  });

  it("should preserve current API key when importing if not in import data", async () => {
    const { updateSettings } = useSettingsStore.getState();
    updateSettings({ apiKey: "existing-key" });

    const mockData = {
      characters: [],
      favorites: [],
      settings: {
        provider: "openai" as const,
        model: "gpt-4o",
        temperature: 0.7,
        theme: "light" as const,
      },
    };

    const mockFile = {
      text: vi.fn().mockResolvedValue(JSON.stringify(mockData)),
      name: "backup.json",
      type: "application/json",
    } as unknown as File;

    const { importData } = useSettingsStore.getState();
    await importData(mockFile);

    const state = useSettingsStore.getState();
    expect(state.settings.apiKey).toBe("existing-key");
  });
});
