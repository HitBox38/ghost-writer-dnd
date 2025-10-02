import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterDropdown } from "../character-dropdown";
import type { CharacterProfile } from "@/lib/types";

describe("CharacterDropdown", () => {
  const mockCharacters: CharacterProfile[] = [
    {
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
    },
    {
      id: "2",
      name: "Legolas",
      race: "Elf",
      class: "Ranger",
      level: 8,
      backstory: "A skilled archer",
      appearance: "Elven archer",
      worldSetting: "Middle Earth",
      favorites: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  const mockOnSelectCharacter = vi.fn();
  const mockOnCreateNew = vi.fn();

  it("should render with active character name", () => {
    render(
      <CharacterDropdown
        characters={mockCharacters}
        activeCharacter={mockCharacters[0]}
        onSelectCharacter={mockOnSelectCharacter}
        onCreateNew={mockOnCreateNew}
      />
    );

    expect(screen.getByText("Aragorn")).toBeDefined();
  });

  it('should render "Select Character" when no active character', () => {
    render(
      <CharacterDropdown
        characters={mockCharacters}
        activeCharacter={null}
        onSelectCharacter={mockOnSelectCharacter}
        onCreateNew={mockOnCreateNew}
      />
    );

    expect(screen.getByText("Select Character")).toBeDefined();
  });

  it("should show all characters when dropdown is opened", async () => {
    const user = userEvent.setup();
    render(
      <CharacterDropdown
        characters={mockCharacters}
        activeCharacter={mockCharacters[0]}
        onSelectCharacter={mockOnSelectCharacter}
        onCreateNew={mockOnCreateNew}
      />
    );

    await user.click(screen.getByRole("button", { name: /aragorn/i }));

    expect(screen.getAllByText(/Aragorn/)).toHaveLength(2); // Button + menu item
    expect(screen.getByText("Legolas")).toBeDefined();
    expect(screen.getByText(/Level 10 Human Ranger/)).toBeDefined();
    expect(screen.getByText(/Level 8 Elf Ranger/)).toBeDefined();
  });

  it("should call onSelectCharacter when a character is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CharacterDropdown
        characters={mockCharacters}
        activeCharacter={mockCharacters[0]}
        onSelectCharacter={mockOnSelectCharacter}
        onCreateNew={mockOnCreateNew}
      />
    );

    await user.click(screen.getByRole("button", { name: /aragorn/i }));
    await user.click(screen.getByText("Legolas"));

    expect(mockOnSelectCharacter).toHaveBeenCalledWith("2");
  });

  it("should call onCreateNew when Create New Character is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CharacterDropdown
        characters={mockCharacters}
        activeCharacter={mockCharacters[0]}
        onSelectCharacter={mockOnSelectCharacter}
        onCreateNew={mockOnCreateNew}
      />
    );

    await user.click(screen.getByRole("button", { name: /aragorn/i }));
    await user.click(screen.getByText(/Create New Character/));

    expect(mockOnCreateNew).toHaveBeenCalled();
  });
});
