import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCharacterForm } from "../use-character-form";
import { useCharacterStore } from "@/stores/character-store";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import type { CharacterProfile } from "@/lib/types";

// Mock stores
vi.mock("@/stores/character-store", () => ({
  useCharacterStore: vi.fn(),
}));

// Mock storage
vi.mock("@/lib/storage", () => ({
  storage: {
    fileToBase64: vi.fn(),
  },
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useCharacterForm", () => {
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

  const mockAddCharacter = vi.fn();
  const mockUpdateCharacter = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      addCharacter: mockAddCharacter,
      updateCharacter: mockUpdateCharacter,
      setActiveCharacter: vi.fn(),
      deleteCharacter: vi.fn(),
      getActiveCharacter: vi.fn(),
      addFavorite: vi.fn(),
      toggleFavorite: vi.fn(),
    });
  });

  it("should initialize with empty form data for new character", () => {
    const { result } = renderHook(() => useCharacterForm(undefined, mockOnClose));

    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.class).toBe("");
    expect(result.current.formData.level).toBe(1);
    expect(result.current.existingCharacter).toBeNull();
  });

  it("should initialize with existing character data", () => {
    const { result } = renderHook(() => useCharacterForm("1", mockOnClose));

    expect(result.current.formData.name).toBe("Aragorn");
    expect(result.current.formData.class).toBe("Ranger");
    expect(result.current.formData.level).toBe(10);
    expect(result.current.existingCharacter).toEqual(mockCharacter);
  });

  it("should handle input change", () => {
    const { result } = renderHook(() => useCharacterForm());

    act(() => {
      result.current.handleInputChange("name", "Legolas");
    });

    expect(result.current.formData.name).toBe("Legolas");
  });

  it("should handle file upload successfully", async () => {
    vi.mocked(storage.fileToBase64).mockResolvedValue("base64content");
    const mockFile = new File(["pdf content"], "character.pdf", { type: "application/pdf" });
    const mockEvent = {
      target: { files: [mockFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useCharacterForm());

    await act(async () => {
      await result.current.handleFileUpload(mockEvent);
    });

    await waitFor(() => {
      expect(storage.fileToBase64).toHaveBeenCalledWith(mockFile);
      expect(result.current.formData.characterSheet).toBe("base64content");
      expect(toast.success).toHaveBeenCalledWith("Character sheet uploaded");
    });
  });

  it("should handle no file selected", async () => {
    const mockEvent = {
      target: { files: [] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useCharacterForm());
    const initialSheet = result.current.formData.characterSheet;

    await act(async () => {
      await result.current.handleFileUpload(mockEvent);
    });

    expect(storage.fileToBase64).not.toHaveBeenCalled();
    expect(result.current.formData.characterSheet).toBe(initialSheet);
  });

  it("should reject non-PDF files", async () => {
    const mockFile = new File(["content"], "file.txt", { type: "text/plain" });
    const mockEvent = {
      target: { files: [mockFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useCharacterForm());

    await act(async () => {
      await result.current.handleFileUpload(mockEvent);
    });

    expect(toast.error).toHaveBeenCalledWith("Please upload a PDF file");
    expect(storage.fileToBase64).not.toHaveBeenCalled();
  });

  it("should reject files larger than 5MB", async () => {
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });
    const mockEvent = {
      target: { files: [largeFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useCharacterForm());

    await act(async () => {
      await result.current.handleFileUpload(mockEvent);
    });

    expect(toast.error).toHaveBeenCalledWith("File size must be less than 5MB");
    expect(storage.fileToBase64).not.toHaveBeenCalled();
  });

  it("should handle file upload error", async () => {
    vi.mocked(storage.fileToBase64).mockRejectedValue(new Error("Upload failed"));
    const mockFile = new File(["pdf content"], "character.pdf", { type: "application/pdf" });
    const mockEvent = {
      target: { files: [mockFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useCharacterForm());

    await act(async () => {
      await result.current.handleFileUpload(mockEvent);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to upload file");
    });
  });

  it("should handle remove sheet", () => {
    const { result } = renderHook(() => useCharacterForm("1", mockOnClose));

    act(() => {
      result.current.handleRemoveSheet();
    });

    expect(result.current.formData.characterSheet).toBe("");
    expect(toast.success).toHaveBeenCalledWith("Character sheet removed");
  });

  it("should create new character on submit", () => {
    const { result } = renderHook(() => useCharacterForm(undefined, mockOnClose));

    act(() => {
      result.current.handleInputChange("name", "Legolas");
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    expect(mockAddCharacter).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Character created successfully");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should update existing character on submit", () => {
    const { result } = renderHook(() => useCharacterForm("1", mockOnClose));

    act(() => {
      result.current.handleInputChange("name", "Aragorn Updated");
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    expect(mockUpdateCharacter).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        name: "Aragorn Updated",
      })
    );
    expect(toast.success).toHaveBeenCalledWith("Character updated successfully");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should show error when name is empty", () => {
    const { result } = renderHook(() => useCharacterForm());

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    expect(toast.error).toHaveBeenCalledWith("Character name is required");
    expect(mockAddCharacter).not.toHaveBeenCalled();
  });

  it("should show error when save fails", () => {
    mockAddCharacter.mockImplementation(() => {
      throw new Error("Save failed");
    });

    const { result } = renderHook(() => useCharacterForm());

    act(() => {
      result.current.handleInputChange("name", "Test");
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to save character");
  });
});
