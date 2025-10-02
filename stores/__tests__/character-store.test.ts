import { describe, it, expect, beforeEach } from "vitest";
import { useCharacterStore } from "../character-store";
import type { CharacterProfile } from "@/lib/types";

describe("useCharacterStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useCharacterStore.setState({
      characters: [],
      activeCharacterId: null,
    });
  });

  it("should add a character", () => {
    const { addCharacter } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "A powerful wizard",
      appearance: "Grey robes",
      worldSetting: "Middle Earth",
    });

    const state = useCharacterStore.getState();
    expect(state.characters).toHaveLength(1);
    expect(state.characters[0].name).toBe("Gandalf");
    expect(state.characters[0].id).toBeDefined();
    expect(state.activeCharacterId).toBe(state.characters[0].id);
  });

  it("should update a character", () => {
    const { addCharacter, updateCharacter } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const characterId = useCharacterStore.getState().characters[0].id;

    updateCharacter(characterId, { backstory: "Updated backstory" });

    const state = useCharacterStore.getState();
    expect(state.characters[0].backstory).toBe("Updated backstory");
    expect(state.characters[0].updatedAt).toBeGreaterThanOrEqual(state.characters[0].createdAt);
  });

  it("should delete a character", () => {
    const { addCharacter, deleteCharacter } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const characterId = useCharacterStore.getState().characters[0].id;
    deleteCharacter(characterId);

    expect(useCharacterStore.getState().characters).toHaveLength(0);
    expect(useCharacterStore.getState().activeCharacterId).toBeNull();
  });

  it("should add a favorite", () => {
    const { addCharacter, addFavorite } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const characterId = useCharacterStore.getState().characters[0].id;
    addFavorite(characterId, "You shall not pass!", "mockery");

    const state = useCharacterStore.getState();
    expect(state.characters[0].favorites).toHaveLength(1);
    expect(state.characters[0].favorites[0].text).toBe("You shall not pass!");
    expect(state.characters[0].favorites[0].type).toBe("mockery");
  });

  it("should remove a favorite", () => {
    const { addCharacter, addFavorite, removeFavorite } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const characterId = useCharacterStore.getState().characters[0].id;
    addFavorite(characterId, "You shall not pass!", "mockery");

    const favoriteId = useCharacterStore.getState().characters[0].favorites[0].id;
    removeFavorite(characterId, favoriteId);

    expect(useCharacterStore.getState().characters[0].favorites).toHaveLength(0);
  });

  it("should get active character", () => {
    const { addCharacter, getActiveCharacter } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const activeCharacter = getActiveCharacter();
    expect(activeCharacter).toBeDefined();
    expect(activeCharacter?.name).toBe("Gandalf");
  });

  it("should load characters from localStorage", () => {
    const mockCharacters: CharacterProfile[] = [
      {
        id: "1",
        name: "Gandalf",
        class: "Wizard",
        race: "Maia",
        level: 20,
        backstory: "",
        appearance: "",
        worldSetting: "",
        favorites: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    localStorage.setItem("dnd-flavor-characters", JSON.stringify(mockCharacters));

    const { loadCharacters } = useCharacterStore.getState();
    loadCharacters();

    expect(useCharacterStore.getState().characters).toEqual(mockCharacters);
  });

  it("should set active character", () => {
    const { addCharacter, setActiveCharacter } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const characterId = useCharacterStore.getState().characters[0].id;
    setActiveCharacter(characterId);

    expect(useCharacterStore.getState().activeCharacterId).toBe(characterId);
  });

  it("should import characters", () => {
    const mockCharacters: CharacterProfile[] = [
      {
        id: "1",
        name: "Imported Character",
        class: "Paladin",
        race: "Human",
        level: 10,
        backstory: "Imported",
        appearance: "Shining armor",
        worldSetting: "Forgotten Realms",
        favorites: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    const { importCharacters } = useCharacterStore.getState();
    importCharacters(mockCharacters);

    const state = useCharacterStore.getState();
    expect(state.characters).toEqual(mockCharacters);
    expect(state.activeCharacterId).toBe("1");
  });

  it("should set active character to first remaining after deleting active", () => {
    const { addCharacter, deleteCharacter } = useCharacterStore.getState();

    // Add two characters
    addCharacter({
      name: "First",
      class: "Wizard",
      race: "Elf",
      level: 5,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    addCharacter({
      name: "Second",
      class: "Warrior",
      race: "Human",
      level: 3,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const state = useCharacterStore.getState();
    const firstId = state.characters[0].id;
    const secondId = state.characters[1].id;

    // Set first as active and delete it
    useCharacterStore.setState({ activeCharacterId: firstId });
    deleteCharacter(firstId);

    // Should switch to second character
    expect(useCharacterStore.getState().activeCharacterId).toBe(secondId);
  });

  it("should preserve active character when deleting different character", () => {
    const { addCharacter, deleteCharacter } = useCharacterStore.getState();

    // Add two characters
    addCharacter({
      name: "First",
      class: "Wizard",
      race: "Elf",
      level: 5,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    addCharacter({
      name: "Second",
      class: "Warrior",
      race: "Human",
      level: 3,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const state = useCharacterStore.getState();
    const firstId = state.characters[0].id;
    const secondId = state.characters[1].id;

    // Set second as active and delete first
    useCharacterStore.setState({ activeCharacterId: secondId });
    deleteCharacter(firstId);

    // Should keep second as active
    expect(useCharacterStore.getState().activeCharacterId).toBe(secondId);
  });

  it("should return null for active character when none is set", () => {
    const { getActiveCharacter } = useCharacterStore.getState();
    expect(getActiveCharacter()).toBeNull();
  });

  it("should add favorite with context", () => {
    const { addCharacter, addFavorite } = useCharacterStore.getState();

    addCharacter({
      name: "Gandalf",
      class: "Wizard",
      race: "Maia",
      level: 20,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const characterId = useCharacterStore.getState().characters[0].id;
    addFavorite(characterId, "Test text", "mockery", "Test context");

    const state = useCharacterStore.getState();
    expect(state.characters[0].favorites[0].context).toBe("Test context");
  });

  it("should not modify other characters when updating", () => {
    const { addCharacter, updateCharacter } = useCharacterStore.getState();

    addCharacter({
      name: "First",
      class: "Wizard",
      race: "Elf",
      level: 5,
      backstory: "Original",
      appearance: "",
      worldSetting: "",
    });

    addCharacter({
      name: "Second",
      class: "Warrior",
      race: "Human",
      level: 3,
      backstory: "Original",
      appearance: "",
      worldSetting: "",
    });

    const firstId = useCharacterStore.getState().characters[0].id;
    updateCharacter(firstId, { backstory: "Updated" });

    const state = useCharacterStore.getState();
    expect(state.characters[0].backstory).toBe("Updated");
    expect(state.characters[1].backstory).toBe("Original");
  });

  it("should not modify other characters when adding favorite", () => {
    const { addCharacter, addFavorite } = useCharacterStore.getState();

    addCharacter({
      name: "First",
      class: "Wizard",
      race: "Elf",
      level: 5,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    addCharacter({
      name: "Second",
      class: "Warrior",
      race: "Human",
      level: 3,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const firstId = useCharacterStore.getState().characters[0].id;
    addFavorite(firstId, "Favorite text", "mockery");

    const state = useCharacterStore.getState();
    expect(state.characters[0].favorites.length).toBe(1);
    expect(state.characters[1].favorites.length).toBe(0);
  });

  it("should not modify other characters when removing favorite", () => {
    const { addCharacter, addFavorite, removeFavorite } = useCharacterStore.getState();

    addCharacter({
      name: "First",
      class: "Wizard",
      race: "Elf",
      level: 5,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    addCharacter({
      name: "Second",
      class: "Warrior",
      race: "Human",
      level: 3,
      backstory: "",
      appearance: "",
      worldSetting: "",
    });

    const firstId = useCharacterStore.getState().characters[0].id;
    const secondId = useCharacterStore.getState().characters[1].id;

    addFavorite(firstId, "First favorite", "mockery");
    addFavorite(secondId, "Second favorite", "mockery");

    const favoriteId = useCharacterStore.getState().characters[0].favorites[0].id;
    removeFavorite(firstId, favoriteId);

    const state = useCharacterStore.getState();
    expect(state.characters[0].favorites.length).toBe(0);
    expect(state.characters[1].favorites.length).toBe(1);
  });
});
