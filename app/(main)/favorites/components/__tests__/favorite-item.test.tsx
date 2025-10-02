import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteItem } from "../favorite-item";
import type { FavoriteText } from "@/lib/types";

describe("FavoriteItem", () => {
  const mockFavorite: FavoriteText = {
    id: "test-id",
    text: "Test favorite text",
    type: "mockery",
    context: "Test context",
    createdAt: new Date("2024-01-01").getTime(),
  };

  const mockOnCopy = vi.fn();
  const mockOnRemove = vi.fn();

  it("should render favorite text", () => {
    render(<FavoriteItem favorite={mockFavorite} onCopy={mockOnCopy} onRemove={mockOnRemove} />);

    expect(screen.getByText("Test favorite text")).toBeInTheDocument();
  });

  it("should render correct badge for mockery type", () => {
    render(<FavoriteItem favorite={mockFavorite} onCopy={mockOnCopy} onRemove={mockOnRemove} />);

    expect(screen.getByText("Combat Quip")).toBeInTheDocument();
  });

  it("should render correct badge for catchphrase type", () => {
    const catchphraseFavorite = { ...mockFavorite, type: "catchphrase" as const };
    render(
      <FavoriteItem favorite={catchphraseFavorite} onCopy={mockOnCopy} onRemove={mockOnRemove} />
    );

    expect(screen.getByText("Catchphrase")).toBeInTheDocument();
  });

  it("should render context when provided", () => {
    render(<FavoriteItem favorite={mockFavorite} onCopy={mockOnCopy} onRemove={mockOnRemove} />);

    expect(screen.getByText(/Context: Test context/)).toBeInTheDocument();
  });

  it("should not render context when not provided", () => {
    const favoriteWithoutContext = { ...mockFavorite, context: undefined };
    render(
      <FavoriteItem favorite={favoriteWithoutContext} onCopy={mockOnCopy} onRemove={mockOnRemove} />
    );

    expect(screen.queryByText(/Context:/)).not.toBeInTheDocument();
  });

  it("should render formatted date", () => {
    render(<FavoriteItem favorite={mockFavorite} onCopy={mockOnCopy} onRemove={mockOnRemove} />);

    expect(screen.getByText(/01\/01\/2024|1\/1\/2024/)).toBeInTheDocument();
  });

  it("should call onCopy when copy button is clicked", async () => {
    const user = userEvent.setup();
    render(<FavoriteItem favorite={mockFavorite} onCopy={mockOnCopy} onRemove={mockOnRemove} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    expect(mockOnCopy).toHaveBeenCalledWith("Test favorite text");
  });

  it("should call onRemove when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<FavoriteItem favorite={mockFavorite} onCopy={mockOnCopy} onRemove={mockOnRemove} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnRemove).toHaveBeenCalledWith("test-id");
  });
});
