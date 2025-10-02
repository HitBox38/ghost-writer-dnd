import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSettingsDialog } from "../use-settings-dialog";
import { useSettingsStore } from "@/stores/settings-store";
import { testConnection } from "@/lib/ai-generator";
import { toast } from "sonner";

// Mock stores
vi.mock("@/stores/settings-store", () => ({
  useSettingsStore: vi.fn(),
}));

// Mock AI generator
vi.mock("@/lib/ai-generator", () => ({
  testConnection: vi.fn(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock window.confirm
const mockConfirm = vi.spyOn(window, "confirm");

describe("useSettingsDialog", () => {
  const mockUpdateSettings = vi.fn();
  const mockSetProvider = vi.fn();
  const mockSetTheme = vi.fn();
  const mockExportData = vi.fn();
  const mockImportData = vi.fn();
  const mockClearAllData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(false);

    vi.mocked(useSettingsStore).mockReturnValue({
      settings: {
        provider: "openai",
        model: "gpt-4",
        apiKey: "test-key",
        apiKeys: {
          openai: "openai-key",
          anthropic: "",
          google: "",
        },
        temperature: 0.7,
        theme: "dark",
      },
      updateSettings: mockUpdateSettings,
      setProvider: mockSetProvider,
      setApiKey: vi.fn(),
      setTheme: mockSetTheme,
      testConnection: vi.fn(),
      exportData: mockExportData,
      importData: mockImportData,
      clearAllData: mockClearAllData,
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSettingsDialog());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isTesting).toBe(false);
    expect(result.current.testResults).toEqual({});
  });

  it("should handle API key change for current provider", () => {
    const { result } = renderHook(() => useSettingsDialog());

    act(() => {
      result.current.handleApiKeyChange("openai", "new-key");
    });

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      apiKeys: {
        openai: "new-key",
        anthropic: "",
        google: "",
      },
      apiKey: "new-key",
    });
  });

  it("should handle API key change and switch provider", () => {
    const { result } = renderHook(() => useSettingsDialog());

    act(() => {
      result.current.handleApiKeyChange("anthropic", "anthropic-key");
    });

    expect(mockUpdateSettings).toHaveBeenCalled();
    expect(mockSetProvider).toHaveBeenCalledWith("anthropic");
  });

  it("should not switch provider when clearing API key", () => {
    const { result } = renderHook(() => useSettingsDialog());

    act(() => {
      result.current.handleApiKeyChange("anthropic", "");
    });

    expect(mockSetProvider).not.toHaveBeenCalled();
  });

  it("should test connections successfully", async () => {
    vi.mocked(testConnection).mockResolvedValue(true);

    const { result } = renderHook(() => useSettingsDialog());

    await act(async () => {
      await result.current.handleTestConnection();
    });

    await waitFor(() => {
      expect(result.current.isTesting).toBe(false);
      expect(result.current.testResults).toEqual({ openai: true });
      expect(toast.success).toHaveBeenCalledWith("All 1 provider(s) connected successfully!");
    });
  });

  it("should handle partial connection success", async () => {
    vi.mocked(useSettingsStore).mockReturnValue({
      settings: {
        provider: "openai",
        model: "gpt-4",
        apiKey: "test-key",
        apiKeys: {
          openai: "openai-key",
          anthropic: "anthropic-key",
          google: "",
        },
        temperature: 0.7,
        theme: "dark",
      },
      updateSettings: mockUpdateSettings,
      setProvider: mockSetProvider,
      setApiKey: vi.fn(),
      setTheme: mockSetTheme,
      testConnection: vi.fn(),
      exportData: mockExportData,
      importData: mockImportData,
      clearAllData: mockClearAllData,
    });

    vi.mocked(testConnection).mockImplementation(async (provider) => {
      return provider === "openai";
    });

    const { result } = renderHook(() => useSettingsDialog());

    await act(async () => {
      await result.current.handleTestConnection();
    });

    await waitFor(() => {
      expect(result.current.isTesting).toBe(false);
      expect(toast.warning).toHaveBeenCalledWith("1/2 provider(s) connected successfully");
    });
  });

  it("should handle all connection failures", async () => {
    vi.mocked(testConnection).mockResolvedValue(false);

    const { result } = renderHook(() => useSettingsDialog());

    await act(async () => {
      await result.current.handleTestConnection();
    });

    await waitFor(() => {
      expect(result.current.isTesting).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        "All connection tests failed. Please check your API keys."
      );
    });
  });

  it("should handle connection test errors", async () => {
    vi.mocked(testConnection).mockRejectedValue(new Error("Connection error"));

    const { result } = renderHook(() => useSettingsDialog());

    await act(async () => {
      await result.current.handleTestConnection();
    });

    await waitFor(() => {
      expect(result.current.isTesting).toBe(false);
      expect(result.current.testResults).toEqual({ openai: false });
    });
  });

  it("should handle no API keys entered", async () => {
    vi.mocked(useSettingsStore).mockReturnValue({
      settings: {
        provider: "openai",
        model: "gpt-4",
        apiKey: "",
        apiKeys: {
          openai: "",
          anthropic: "",
          google: "",
        },
        temperature: 0.7,
        theme: "dark",
      },
      updateSettings: mockUpdateSettings,
      setProvider: mockSetProvider,
      setApiKey: vi.fn(),
      setTheme: mockSetTheme,
      testConnection: vi.fn(),
      exportData: mockExportData,
      importData: mockImportData,
      clearAllData: mockClearAllData,
    });

    const { result } = renderHook(() => useSettingsDialog());

    await act(async () => {
      await result.current.handleTestConnection();
    });

    expect(toast.error).toHaveBeenCalledWith("Please enter at least one API key");
  });

  it("should handle import successfully", async () => {
    const mockFile = new File(["{}"], "test.json", { type: "application/json" });
    const mockEvent = {
      target: { files: [mockFile], value: "test.json" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useSettingsDialog());

    await act(async () => {
      await result.current.handleImport(mockEvent);
    });

    await waitFor(() => {
      expect(mockImportData).toHaveBeenCalledWith(mockFile);
      expect(toast.success).toHaveBeenCalledWith("Data imported successfully");
      expect(result.current.isOpen).toBe(false);
      expect(mockEvent.target.value).toBe("");
    });
  });

  it("should handle import error", async () => {
    mockImportData.mockRejectedValue(new Error("Import failed"));
    const mockFile = new File(["{}"], "test.json", { type: "application/json" });
    const mockEvent = {
      target: { files: [mockFile], value: "test.json" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useSettingsDialog());

    await act(async () => {
      await result.current.handleImport(mockEvent);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Import failed");
    });
  });

  it("should handle clear all when confirmed", () => {
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useSettingsDialog());

    act(() => {
      result.current.handleClearAll();
    });

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockClearAllData).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("All data cleared");
    expect(result.current.isOpen).toBe(false);
  });

  it("should not clear all when cancelled", () => {
    mockConfirm.mockReturnValue(false);

    const { result } = renderHook(() => useSettingsDialog());

    act(() => {
      result.current.handleClearAll();
    });

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockClearAllData).not.toHaveBeenCalled();
  });

  it("should handle opening and closing dialog", () => {
    const { result } = renderHook(() => useSettingsDialog());

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.setIsOpen(false);
    });

    expect(result.current.isOpen).toBe(false);
  });
});
