import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileSelector } from "../index";
import { useCharacterStore } from "@/stores/character-store";
import type { CharacterProfile } from "@/lib/types";

// Mock stores
vi.mock("@/stores/character-store", () => ({
  useCharacterStore: vi.fn(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock window.confirm
const mockConfirm = vi.spyOn(window, "confirm");

describe("ProfileSelector", () => {
  const mockCharacter: CharacterProfile = {
    id: "1",
    name: "Aragorn",
    race: "Human",
    class: "Ranger",
    level: 10,
    backstory: "A ranger from the north",
    appearance: "Tall and rugged",
    worldSetting: "Middle Earth",
    favorites: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const mockSetActiveCharacter = vi.fn();
  const mockDeleteCharacter = vi.fn();
  const mockGetActiveCharacter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(false);
  });

  it('should show "Create First Character" button when no characters exist', () => {
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    expect(screen.getByRole("button", { name: /create first character/i })).toBeDefined();
  });

  it('should open create dialog when "Create First Character" is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    await user.click(screen.getByRole("button", { name: /create first character/i }));

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getAllByText(/Create Character/)).toHaveLength(3); // Dialog title + card title + button text
  });

  it("should show character dropdown when characters exist", () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    expect(screen.getByText("Aragorn")).toBeDefined();
  });

  it("should show character actions when active character exists", () => {
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    expect(screen.getByRole("button", { name: /edit character/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /delete character/i })).toBeDefined();
  });

  it("should open edit dialog when edit button is clicked", async () => {
    const user = userEvent.setup();
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    await user.click(screen.getByRole("button", { name: /edit character/i }));

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getAllByText(/Edit Character/)).toHaveLength(2); // Dialog title + card title
  });

  it("should delete character when confirmed", async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    await user.click(screen.getByRole("button", { name: /delete character/i }));

    expect(mockConfirm).toHaveBeenCalledWith(
      "Are you sure you want to delete Aragorn? This cannot be undone."
    );
    expect(mockDeleteCharacter).toHaveBeenCalledWith("1");
  });

  it("should not delete character when cancelled", async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);
    mockGetActiveCharacter.mockReturnValue(mockCharacter);
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    await user.click(screen.getByRole("button", { name: /delete character/i }));

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockDeleteCharacter).not.toHaveBeenCalled();
  });

  it("should not show character actions when no active character", () => {
    mockGetActiveCharacter.mockReturnValue(null);
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      setActiveCharacter: mockSetActiveCharacter,
      deleteCharacter: mockDeleteCharacter,
      getActiveCharacter: mockGetActiveCharacter,
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<ProfileSelector />);

    expect(screen.queryByRole("button", { name: /edit character/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /delete character/i })).toBeNull();
  });
});
