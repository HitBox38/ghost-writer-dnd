import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CharacterActions } from "../character-actions";

describe("CharacterActions", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it("should render edit and delete buttons", () => {
    render(<CharacterActions onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByRole("button", { name: /edit character/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /delete character/i })).toBeDefined();
  });

  it("should call onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<CharacterActions onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole("button", { name: /edit character/i }));

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it("should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<CharacterActions onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole("button", { name: /delete character/i }));

    expect(mockOnDelete).toHaveBeenCalled();
  });
});
