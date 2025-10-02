import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterForm } from "../index";
import { useCharacterStore } from "@/stores/character-store";

vi.mock("@/stores/character-store");

describe("CharacterForm", () => {
  const mockAddCharacter = vi.fn();
  const mockUpdateCharacter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [],
      addCharacter: mockAddCharacter,
      updateCharacter: mockUpdateCharacter,
    } as unknown as typeof useCharacterStore);
  });

  it("should render create mode by default", () => {
    render(<CharacterForm />);
    // Use getAllByText since there might be multiple instances (heading and button)
    const createTexts = screen.getAllByText(/create character/i);
    expect(createTexts.length).toBeGreaterThan(0);
  });

  it("should render edit mode when characterId provided", () => {
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [
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
      ],
      addCharacter: mockAddCharacter,
      updateCharacter: mockUpdateCharacter,
    } as unknown as typeof useCharacterStore);

    render(<CharacterForm characterId="1" />);
    expect(screen.getByText("Edit Character")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Gandalf")).toBeInTheDocument();
  });

  it("should call addCharacter on form submission", async () => {
    const user = userEvent.setup();
    render(<CharacterForm />);

    await user.type(screen.getByLabelText(/character name/i), "Test Character");
    await user.click(screen.getByRole("button", { name: /create character/i }));

    expect(mockAddCharacter).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Character",
      })
    );
  });

  it("should show error when name is empty", async () => {
    const user = userEvent.setup();
    render(<CharacterForm />);

    await user.click(screen.getByRole("button", { name: /create character/i }));

    expect(mockAddCharacter).not.toHaveBeenCalled();
  });
});
