import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoritesPage from "../page";
import { useCharacterStore } from "@/stores/character-store";
import type { CharacterProfile } from "@/lib/types";

// Mock stores
vi.mock("@/stores/character-store", () => ({
  useCharacterStore: vi.fn(),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock window.confirm
const mockConfirm = vi.spyOn(window, "confirm");

describe("FavoritesPage - Search Functionality", () => {
  const mockCharacter: CharacterProfile = {
    id: "char-1",
    name: "Gandalf",
    class: "Wizard",
    race: "Maia",
    level: 20,
    backstory: "A wizard",
    appearance: "Grey robes",
    worldSetting: "Middle Earth",
    favorites: [
      {
        id: "fav-1",
        text: "You shall not pass!",
        type: "mockery",
        context: "facing a Balrog",
        createdAt: Date.now(),
      },
      {
        id: "fav-2",
        text: "A wizard is never late",
        type: "catchphrase",
        context: "arriving precisely",
        createdAt: Date.now(),
      },
      {
        id: "fav-3",
        text: "Fly, you fools!",
        type: "mockery",
        context: "dramatic escape",
        createdAt: Date.now(),
      },
      {
        id: "fav-4",
        text: "All we have to decide is what to do with the time that is given us",
        type: "catchphrase",
        createdAt: Date.now(),
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(false);
    vi.mocked(useCharacterStore).mockReturnValue({
      characters: [mockCharacter],
      getActiveCharacter: () => mockCharacter,
      removeFavorite: vi.fn(),
      setActiveCharacter: vi.fn(),
      deleteCharacter: vi.fn(),
      addCharacter: vi.fn(),
      updateCharacter: vi.fn(),
      toggleFavorite: vi.fn(),
    });
  });

  describe("Search Input", () => {
    it("should render search input", () => {
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      expect(searchInput).toBeInTheDocument();
    });

    it("should render search icon", () => {
      render(<FavoritesPage />);

      const searchIcon = document.querySelector("svg");
      expect(searchIcon).toBeInTheDocument();
    });

    it("should not show clear button when search is empty", () => {
      render(<FavoritesPage />);

      const clearButton = screen.queryByRole("button", { name: /x/i });
      expect(clearButton).not.toBeInTheDocument();
    });

    it("should show clear button when search has text", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "wizard");

      // Clear button should appear
      const clearButton = screen.getByRole("button", { name: "" });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe("Search Filtering", () => {
    it("should filter favorites by text content", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "shall not pass");

      expect(screen.getByText("You shall not pass!")).toBeInTheDocument();
      expect(screen.queryByText("A wizard is never late")).not.toBeInTheDocument();
      expect(screen.queryByText("Fly, you fools!")).not.toBeInTheDocument();
    });

    it("should filter favorites by context", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "Balrog");

      expect(screen.getByText("You shall not pass!")).toBeInTheDocument();
      expect(screen.queryByText("A wizard is never late")).not.toBeInTheDocument();
    });

    it("should be case insensitive", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "WIZARD");

      expect(screen.getByText("A wizard is never late")).toBeInTheDocument();
    });

    it("should show all favorites when search is empty", () => {
      render(<FavoritesPage />);

      expect(screen.getByText("You shall not pass!")).toBeInTheDocument();
      expect(screen.getByText("A wizard is never late")).toBeInTheDocument();
      expect(screen.getByText("Fly, you fools!")).toBeInTheDocument();
    });

    it("should filter within selected tab", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      // Switch to Quips tab
      const quipsTab = screen.getByRole("tab", { name: /Quips \(2\)/i });
      await user.click(quipsTab);

      // Search within quips
      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "pass");

      expect(screen.getByText("You shall not pass!")).toBeInTheDocument();
      expect(screen.queryByText("Fly, you fools!")).not.toBeInTheDocument();
      expect(screen.queryByText("A wizard is never late")).not.toBeInTheDocument();
    });

    it("should update results count badge", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      // Initially shows all 4 favorites
      expect(screen.getByText("4 total")).toBeInTheDocument();

      // Search for specific text
      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "wizard");

      // Should update count to 1
      expect(screen.getByText("1 total")).toBeInTheDocument();
    });
  });

  describe("Clear Search", () => {
    it("should clear search when clear button is clicked", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "wizard");

      expect(searchInput).toHaveValue("wizard");

      const clearButton = screen.getByRole("button", { name: "" });
      await user.click(clearButton);

      expect(searchInput).toHaveValue("");
    });

    it("should show all favorites after clearing search", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "wizard");

      expect(screen.queryByText("Fly, you fools!")).not.toBeInTheDocument();

      const clearButton = screen.getByRole("button", { name: "" });
      await user.click(clearButton);

      expect(screen.getByText("Fly, you fools!")).toBeInTheDocument();
    });
  });

  describe("Empty Search Results", () => {
    it("should show empty state when no results match", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "nonexistent text");

      expect(screen.getByText("No results found")).toBeInTheDocument();
      expect(
        screen.getByText(/No favorites match your search "nonexistent text"/)
      ).toBeInTheDocument();
    });

    it("should show clear search button in empty state", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "nonexistent");

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });

    it("should clear search from empty state button", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "nonexistent");

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      await user.click(clearButton);

      expect(searchInput).toHaveValue("");
      expect(screen.queryByText("No results found")).not.toBeInTheDocument();
    });

    it("should show regular empty state when no favorites exist", () => {
      const emptyCharacter = { ...mockCharacter, favorites: [] };
      vi.mocked(useCharacterStore).mockReturnValue({
        characters: [emptyCharacter],
        getActiveCharacter: () => emptyCharacter,
        removeFavorite: vi.fn(),
        setActiveCharacter: vi.fn(),
        deleteCharacter: vi.fn(),
        addCharacter: vi.fn(),
        updateCharacter: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      render(<FavoritesPage />);

      expect(screen.getByText("No Favorites Yet")).toBeInTheDocument();
      expect(screen.queryByText("No results found")).not.toBeInTheDocument();
    });
  });

  describe("Search with Type Filters", () => {
    it("should combine search with All tab", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "you");

      expect(screen.getByText("You shall not pass!")).toBeInTheDocument();
      expect(screen.getByText("Fly, you fools!")).toBeInTheDocument();
      expect(screen.queryByText("A wizard is never late")).not.toBeInTheDocument();
    });

    it("should combine search with Quips tab", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      // Switch to Quips
      const quipsTab = screen.getByRole("tab", { name: /Quips \(2\)/i });
      await user.click(quipsTab);

      // Search
      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "fools");

      expect(screen.getByText("Fly, you fools!")).toBeInTheDocument();
      expect(screen.queryByText("You shall not pass!")).not.toBeInTheDocument();
    });

    it("should combine search with Catchphrases tab", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      // Switch to Catchphrases
      const catchphrasesTab = screen.getByRole("tab", { name: /Catchphrases \(2\)/i });
      await user.click(catchphrasesTab);

      // Search
      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "wizard");

      expect(screen.getByText("A wizard is never late")).toBeInTheDocument();
      expect(screen.queryByText("You shall not pass!")).not.toBeInTheDocument();
      expect(screen.queryByText("Fly, you fools!")).not.toBeInTheDocument();
    });

    it("should persist search when switching tabs", async () => {
      const user = userEvent.setup();
      render(<FavoritesPage />);

      const searchInput = screen.getByPlaceholderText("Search favorites...");
      await user.type(searchInput, "wizard");

      const catchphrasesTab = screen.getByRole("tab", { name: /Catchphrases \(2\)/i });
      await user.click(catchphrasesTab);

      expect(searchInput).toHaveValue("wizard");
      expect(screen.getByText("A wizard is never late")).toBeInTheDocument();
    });
  });

  describe("No Character State", () => {
    it("should show no character state when no active character", () => {
      vi.mocked(useCharacterStore).mockReturnValue({
        characters: [],
        getActiveCharacter: () => null,
        removeFavorite: vi.fn(),
        setActiveCharacter: vi.fn(),
        deleteCharacter: vi.fn(),
        addCharacter: vi.fn(),
        updateCharacter: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      render(<FavoritesPage />);

      expect(screen.getByText("No Character Selected")).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Search favorites...")).not.toBeInTheDocument();
    });
  });
});
