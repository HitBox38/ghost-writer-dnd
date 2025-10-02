import { describe, it, expect, beforeEach, vi } from "vitest";
import { storage } from "../storage";
import type { CharacterProfile, Settings } from "../types";

describe("storage", () => {
  const mockCharacter: CharacterProfile = {
    id: "1",
    name: "Test Character",
    class: "Wizard",
    race: "Elf",
    level: 5,
    backstory: "",
    appearance: "",
    worldSetting: "",
    favorites: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const mockSettings: Settings = {
    provider: "openai",
    apiKey: "test-key",
    apiKeys: {
      openai: "test-key",
      anthropic: "",
      google: "",
    },
    model: "gpt-4",
    temperature: 0.7,
    theme: "dark",
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("getCharacters", () => {
    it("should return empty array when no characters stored", () => {
      expect(storage.getCharacters()).toEqual([]);
    });

    it("should return stored characters", () => {
      const characters: CharacterProfile[] = [
        {
          id: "1",
          name: "Test",
          class: "Wizard",
          race: "Elf",
          level: 5,
          backstory: "",
          appearance: "",
          worldSetting: "",
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem("dnd-flavor-characters", JSON.stringify(characters));
      expect(storage.getCharacters()).toEqual(characters);
    });

    it("should handle corrupted data gracefully", () => {
      localStorage.setItem("dnd-flavor-characters", "invalid json");
      expect(storage.getCharacters()).toEqual([]);
    });
  });

  describe("saveCharacters", () => {
    it("should save characters to localStorage", () => {
      const characters: CharacterProfile[] = [
        {
          id: "1",
          name: "Test",
          class: "Wizard",
          race: "Elf",
          level: 5,
          backstory: "",
          appearance: "",
          worldSetting: "",
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      storage.saveCharacters(characters);
      expect(JSON.parse(localStorage.getItem("dnd-flavor-characters")!)).toEqual(characters);
    });
  });

  describe("exportData", () => {
    it("should export data without API key", () => {
      const characters: CharacterProfile[] = [];
      const settings: Settings = {
        provider: "openai",
        apiKey: "secret-key",
        apiKeys: { openai: "secret", anthropic: "", google: "" },
        model: "gpt-4o",
        temperature: 0.8,
        theme: "dark",
      };

      localStorage.setItem("dnd-flavor-characters", JSON.stringify(characters));
      localStorage.setItem("dnd-flavor-settings", JSON.stringify(settings));

      const exported = storage.exportData();
      const data = JSON.parse(exported);

      expect(data.characters).toEqual(characters);
      expect(data.settings.apiKey).toBeUndefined();
      expect(data.version).toBe("1.0.0");
      expect(data.exportDate).toBeDefined();
    });
  });

  describe("importData", () => {
    it("should import valid data", () => {
      const jsonData = JSON.stringify({
        characters: [],
        settings: { provider: "openai" },
      });

      const result = storage.importData(jsonData);
      expect(result.characters).toEqual([]);
      expect(result.settings.provider).toBe("openai");
    });

    it("should throw error for invalid data", () => {
      expect(() => storage.importData("invalid")).toThrow();
    });

    it("should throw error for missing characters", () => {
      const jsonData = JSON.stringify({ settings: {} });
      expect(() => storage.importData(jsonData)).toThrow("Failed to import data");
    });
  });

  describe("fileToBase64", () => {
    it("should convert file to base64", async () => {
      const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
      const base64 = await storage.fileToBase64(file);
      expect(base64).toContain("data:application/pdf;base64");
    });
  });

  describe("clearAll", () => {
    it("should clear all stored data", () => {
      localStorage.setItem("dnd-flavor-characters", "[]");
      localStorage.setItem("dnd-flavor-settings", "{}");
      storage.clearAll();
      expect(localStorage.getItem("dnd-flavor-characters")).toBeNull();
      expect(localStorage.getItem("dnd-flavor-settings")).toBeNull();
    });

    it("should handle errors when clearing storage", () => {
      const mockRemoveItem = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new Error("Storage error");
      });

      // Should not throw
      expect(() => storage.clearAll()).not.toThrow();

      mockRemoveItem.mockRestore();
    });
  });

  describe("getSettings", () => {
    it("should return empty object when no settings stored", () => {
      expect(storage.getSettings()).toEqual({});
    });

    it("should return stored settings", () => {
      const settings: Settings = {
        provider: "openai",
        apiKey: "test-key",
        apiKeys: { openai: "test", anthropic: "", google: "" },
        model: "gpt-4o",
        temperature: 0.8,
        theme: "dark",
      };
      localStorage.setItem("dnd-flavor-settings", JSON.stringify(settings));
      expect(storage.getSettings()).toEqual(settings);
    });

    it("should handle corrupted settings data gracefully", () => {
      localStorage.setItem("dnd-flavor-settings", "invalid json");
      expect(storage.getSettings()).toEqual({});
    });
  });

  describe("saveSettings", () => {
    it("should save settings to localStorage", () => {
      const settings: Settings = {
        provider: "openai",
        apiKey: "test-key",
        apiKeys: { openai: "test", anthropic: "", google: "" },
        model: "gpt-4o",
        temperature: 0.8,
        theme: "dark",
      };
      storage.saveSettings(settings);
      expect(JSON.parse(localStorage.getItem("dnd-flavor-settings")!)).toEqual(settings);
    });

    it("should throw error when localStorage is full", () => {
      const mockSetItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const settings: Settings = {
        provider: "openai",
        apiKey: "test",
        apiKeys: { openai: "", anthropic: "", google: "" },
        model: "gpt-4o",
        temperature: 0.8,
        theme: "system",
      };

      expect(() => storage.saveSettings(settings)).toThrow("Failed to save settings");

      mockSetItem.mockRestore();
    });
  });

  describe("saveCharacters error handling", () => {
    it("should throw error when localStorage is full", () => {
      const mockSetItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const characters: CharacterProfile[] = [
        {
          id: "1",
          name: "Test",
          class: "Wizard",
          race: "Elf",
          level: 5,
          backstory: "",
          appearance: "",
          worldSetting: "",
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      expect(() => storage.saveCharacters(characters)).toThrow("Failed to save characters");

      mockSetItem.mockRestore();
    });
  });

  describe("SSR compatibility", () => {
    it("should return empty array when window is undefined for getCharacters", () => {
      const originalWindow = global.window;
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const result = storage.getCharacters();
      expect(result).toEqual([]);

      Object.defineProperty(global, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    });

    it("should return empty object when window is undefined for getSettings", () => {
      const originalWindow = global.window;
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const result = storage.getSettings();
      expect(result).toEqual({});

      Object.defineProperty(global, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    });

    it("should do nothing when window is undefined for saveCharacters", () => {
      const originalWindow = global.window;
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => storage.saveCharacters([mockCharacter])).not.toThrow();

      Object.defineProperty(global, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    });

    it("should do nothing when window is undefined for saveSettings", () => {
      const originalWindow = global.window;
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => storage.saveSettings(mockSettings)).not.toThrow();

      Object.defineProperty(global, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    });

    it("should do nothing when window is undefined for clearAll", () => {
      const originalWindow = global.window;
      Object.defineProperty(global, "window", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => storage.clearAll()).not.toThrow();

      Object.defineProperty(global, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    });
  });

  describe("downloadFile", () => {
    it("should trigger file download", () => {
      const mockClick = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockRevokeObjectURL = vi.fn();

      const mockAnchor = {
        href: "",
        download: "",
        click: mockClick,
      };

      vi.spyOn(document, "createElement").mockReturnValue(mockAnchor as unknown as HTMLElement);
      vi.spyOn(document.body, "appendChild").mockImplementation(mockAppendChild);
      vi.spyOn(document.body, "removeChild").mockImplementation(mockRemoveChild);

      // Mock URL.createObjectURL
      global.URL.createObjectURL = vi.fn().mockReturnValue("blob:test");
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      storage.downloadFile('{"test": "data"}', "test.json");

      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:test");

      vi.restoreAllMocks();
    });
  });
});
