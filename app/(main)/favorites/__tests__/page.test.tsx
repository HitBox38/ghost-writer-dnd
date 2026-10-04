import { beforeEach, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoritesPage from "@/app/(main)/favorites/page";
import { useCharacterStore } from "@/stores/character-store";
import { characterFixture, quipFixtures } from "@/tests/fixtures/characters";
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));
beforeEach(() =>
  useCharacterStore.setState({
    initialized: true,
    activeCharacterId: "merrin",
    characters: [
      {
        ...characterFixture,
        favorites: quipFixtures.map((line, index) => ({
          ...line,
          type: index % 2 ? "catchphrase" : "mockery",
          context: index % 2 ? "Tavern" : "Battle",
          createdAt: 1700000000000,
        })),
      },
    ],
  }),
);
it("searches both text and scene, then combines type filters", async () => {
  render(<FavoritesPage />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Search saved lines"), "TAVERN");
  expect(screen.getAllByRole("article")).toHaveLength(6);
  await user.click(
    screen.getByRole("button", {
      name: "Combat quips",
    }),
  );
  expect(
    screen.getByRole("heading", {
      name: "No matching lines",
    }),
  ).toBeVisible();
  await user.click(
    screen.getByRole("button", {
      name: "Clear filters",
    }),
  );
  expect(screen.getAllByRole("article")).toHaveLength(12);
  await user.type(screen.getByLabelText("Search saved lines"), "butter knife");
  expect(screen.getAllByRole("article")).toHaveLength(1);
});
it("removes a saved line from storage", async () => {
  render(<FavoritesPage />);
  await userEvent.setup().click(
    screen.getAllByRole("button", {
      name: "Unsave line",
    })[0],
  );
  expect(useCharacterStore.getState().characters[0].favorites).toHaveLength(11);
});
it("disables random selection when nothing matches", async () => {
  render(<FavoritesPage />);
  await userEvent.setup().type(screen.getByLabelText("Search saved lines"), "no such line");
  expect(
    screen.getByRole("button", {
      name: "Pick & copy",
    }),
  ).toBeDisabled();
});
it("guides an empty collection back to writing", () => {
  useCharacterStore.setState({
    characters: [characterFixture],
  });
  render(<FavoritesPage />);
  expect(
    screen.getByRole("link", {
      name: "Write some lines",
    }),
  ).toHaveAttribute("href", "/generate");
});
it("waits for storage hydration and handles no active character", () => {
  useCharacterStore.setState({
    initialized: false,
  });
  const { rerender } = render(<FavoritesPage />);
  expect(screen.getByRole("status")).toHaveTextContent("Opening saved lines");
  act(() =>
    useCharacterStore.setState({
      initialized: true,
      characters: [],
      activeCharacterId: null,
    }),
  );
  rerender(<FavoritesPage />);
  expect(
    screen.getByRole("link", {
      name: "Create your first character",
    }),
  ).toBeVisible();
});
