import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RandomButton } from "../random-button";
import type { FavoriteText } from "@/lib/types";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("RandomButton", () => {
  const mockFavorites: FavoriteText[] = [
    {
      id: "fav-1",
      text: "First favorite",
      type: "mockery",
      createdAt: Date.now(),
    },
    {
      id: "fav-2",
      text: "Second favorite",
      type: "catchphrase",
      createdAt: Date.now(),
    },
    {
      id: "fav-3",
      text: "Third favorite",
      type: "mockery",
      createdAt: Date.now(),
    },
  ];

  const mockSetSelectedFavoriteId = vi.fn();
  const mockHandleCopy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the shuffle button", () => {
    render(
      <RandomButton
        filteredFavorites={mockFavorites}
        setSelectedFavoriteId={mockSetSelectedFavoriteId}
        handleCopy={mockHandleCopy}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should show error toast when no favorites are available", async () => {
    const user = userEvent.setup();
    render(
      <RandomButton
        filteredFavorites={[]}
        setSelectedFavoriteId={mockSetSelectedFavoriteId}
        handleCopy={mockHandleCopy}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(toast.error).toHaveBeenCalledWith("No favorites to select from");
    expect(mockSetSelectedFavoriteId).not.toHaveBeenCalled();
    expect(mockHandleCopy).not.toHaveBeenCalled();
  });

  it("should select a random favorite and copy it", async () => {
    const user = userEvent.setup();
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.5); // Will select index 1

    render(
      <RandomButton
        filteredFavorites={mockFavorites}
        setSelectedFavoriteId={mockSetSelectedFavoriteId}
        handleCopy={mockHandleCopy}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSetSelectedFavoriteId).toHaveBeenCalledWith("fav-2");
    expect(mockHandleCopy).toHaveBeenCalledWith("Second favorite");
    expect(toast.success).toHaveBeenCalledWith("Random catchphrase copied!");

    mockRandom.mockRestore();
  });

  it("should select first favorite when random is 0", async () => {
    const user = userEvent.setup();
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0);

    render(
      <RandomButton
        filteredFavorites={mockFavorites}
        setSelectedFavoriteId={mockSetSelectedFavoriteId}
        handleCopy={mockHandleCopy}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSetSelectedFavoriteId).toHaveBeenCalledWith("fav-1");
    expect(mockHandleCopy).toHaveBeenCalledWith("First favorite");
    expect(toast.success).toHaveBeenCalledWith("Random mockery copied!");

    mockRandom.mockRestore();
  });

  it("should select last favorite when random is close to 1", async () => {
    const user = userEvent.setup();
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.99);

    render(
      <RandomButton
        filteredFavorites={mockFavorites}
        setSelectedFavoriteId={mockSetSelectedFavoriteId}
        handleCopy={mockHandleCopy}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSetSelectedFavoriteId).toHaveBeenCalledWith("fav-3");
    expect(mockHandleCopy).toHaveBeenCalledWith("Third favorite");
    expect(toast.success).toHaveBeenCalledWith("Random mockery copied!");

    mockRandom.mockRestore();
  });

  it("should work with a single favorite", async () => {
    const user = userEvent.setup();
    const singleFavorite: FavoriteText[] = [
      {
        id: "only-fav",
        text: "Only favorite",
        type: "catchphrase",
        createdAt: Date.now(),
      },
    ];

    render(
      <RandomButton
        filteredFavorites={singleFavorite}
        setSelectedFavoriteId={mockSetSelectedFavoriteId}
        handleCopy={mockHandleCopy}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSetSelectedFavoriteId).toHaveBeenCalledWith("only-fav");
    expect(mockHandleCopy).toHaveBeenCalledWith("Only favorite");
    expect(toast.success).toHaveBeenCalledWith("Random catchphrase copied!");
  });

  it("should call all callbacks in correct order", async () => {
    const user = userEvent.setup();
    const callOrder: string[] = [];

    const trackingSetSelectedFavoriteId = vi.fn(() => callOrder.push("setSelectedFavoriteId"));
    const trackingHandleCopy = vi.fn(() => callOrder.push("handleCopy"));

    render(
      <RandomButton
        filteredFavorites={mockFavorites}
        setSelectedFavoriteId={trackingSetSelectedFavoriteId}
        handleCopy={trackingHandleCopy}
      />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(callOrder).toEqual(["setSelectedFavoriteId", "handleCopy"]);
  });
});
