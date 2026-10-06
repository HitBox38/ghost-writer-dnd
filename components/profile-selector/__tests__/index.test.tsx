import { expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileSelector } from "@/components/profile-selector/index";
import { useCharacterStore } from "@/stores/character-store";
import { characterFixture } from "@/tests/fixtures/characters";
beforeEach(() =>
  useCharacterStore.setState({
    characters: [],
    activeCharacterId: null,
    initialized: true,
  }),
);
it("links to the dedicated create page when empty", () => {
  render(<ProfileSelector />);
  expect(
    screen.getByRole("link", {
      name: "Create character",
    }),
  ).toHaveAttribute("href", "/characters/new");
});
it("links editing to the active character and switches the workspace character", async () => {
  useCharacterStore.setState({
    characters: [
      characterFixture,
      {
        ...characterFixture,
        id: "other",
        name: "Other bard",
      },
    ],
    activeCharacterId: characterFixture.id,
  });
  render(<ProfileSelector />);
  expect(
    screen.getByRole("link", {
      name: "Edit Merrin Ashvale",
    }),
  ).toHaveAttribute("href", "/characters/merrin/edit");
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: "Choose character",
    }),
  );
  await user.click(
    await screen.findByRole("menuitem", {
      name: /Other bard/,
    }),
  );
  expect(useCharacterStore.getState().activeCharacterId).toBe("other");
});
