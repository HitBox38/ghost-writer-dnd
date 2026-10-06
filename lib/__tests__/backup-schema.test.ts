import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { storage } from "@/lib/storage";
import { characterFixture } from "@/tests/fixtures/characters";
import { useSettingsStore } from "@/stores/settings-store";
import { useCharacterStore } from "@/stores/character-store";
import { AI_PROVIDER_IDS, emptyApiKeys } from "@/lib/types";

beforeEach(() => {
  localStorage.clear();
  storage.saveCharacters([characterFixture]);
  useCharacterStore.setState({ characters: [characterFixture], activeCharacterId: "merrin" });
});
afterEach(() => vi.restoreAllMocks());
it("excludes every provider key and ignores credentials in old backups", () => {
  const apiKeys = Object.fromEntries(
    AI_PROVIDER_IDS.map((provider) => [provider, `secret-${provider}`]),
  ) as ReturnType<typeof emptyApiKeys>;
  useSettingsStore.getState().updateSettings({
    apiKey: "secret-openai",
    apiKeys,
  });
  const exported = storage.exportData();
  for (const secret of Object.values(apiKeys)) expect(exported).not.toContain(secret);
  expect(
    storage.importData(
      JSON.stringify({
        characters: [characterFixture],
        settings: { apiKey: "bad", apiKeys: { openai: "bad" } },
      }),
    ).settings,
  ).toEqual({});
});
it("restores a selected new provider without importing its credentials", () => {
  const restored = storage.importData(
    JSON.stringify({
      characters: [characterFixture],
      settings: { provider: "cerebras", model: "some-current-model", apiKey: "ignore-me" },
    }),
  );
  expect(restored.settings).toEqual({ provider: "cerebras", model: "some-current-model" });
});
it("round-trips reasoning effort in settings backups", () => {
  useSettingsStore.getState().updateSettings({ model: "gpt-5", reasoningEffort: "low" });
  expect(storage.importData(storage.exportData()).settings.reasoningEffort).toBe("low");
});
it("round-trips uploaded portraits and legacy empty PDF fields", () => {
  const character = {
    ...characterFixture,
    portrait: "data:image/webp;base64,AAAA",
    characterSheet: "",
  };
  storage.saveCharacters([character]);
  expect(storage.importData(storage.exportData()).characters[0]).toEqual(character);
});
it("rejects remote portraits, invalid levels, and duplicate IDs before applying data", () => {
  for (const characters of [
    [{ ...characterFixture, portrait: "https://example.com/track.png" }],
    [{ ...characterFixture, level: 40 }],
    [characterFixture, characterFixture],
  ]) {
    expect(() => storage.importData(JSON.stringify({ characters }))).toThrow("Failed to import");
  }
  expect(storage.getCharacters()).toEqual([characterFixture]);
});
it("rolls back a backup restore when saving settings fails", async () => {
  const currentSettings = useSettingsStore.getState().settings;
  storage.saveSettings(currentSettings);
  const save = vi.spyOn(storage, "saveSettings").mockImplementationOnce(() => {
    throw new Error("Quota exceeded");
  });
  const file = {
    text: async () =>
      JSON.stringify({
        characters: [{ ...characterFixture, name: "Replacement" }],
        settings: { theme: "dark" },
      }),
  } as File;
  await expect(useSettingsStore.getState().importData(file)).rejects.toThrow("Quota exceeded");
  expect(save).toHaveBeenCalledTimes(2);
  expect(storage.getCharacters()).toEqual([characterFixture]);
  expect(useCharacterStore.getState().characters).toEqual([characterFixture]);
});

it("retains PDF metadata through export and import", () => {
  const character = {
    ...characterFixture,
    characterSheet: "data:application/pdf;base64,AAAA",
    characterSheetMetadata: { name: "sheet.pdf", size: 3, uploadedAt: 1700000000000 },
  };
  storage.saveCharacters([character]);
  expect(storage.importData(storage.exportData()).characters[0]).toEqual(character);
});
