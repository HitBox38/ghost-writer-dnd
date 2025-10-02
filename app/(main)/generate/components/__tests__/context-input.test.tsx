import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextInput } from "../context-input";

describe("ContextInput", () => {
  const mockOnChange = vi.fn();
  const mockOnKeyDown = vi.fn();

  it("should render with correct placeholder for mockery", () => {
    render(
      <ContextInput
        value=""
        generationType="mockery"
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    const textarea = screen.getByLabelText(/additional context/i);
    expect(textarea).toHaveAttribute(
      "placeholder",
      "e.g., 'against a pompous noble' or 'targeting their armor'"
    );
  });

  it("should render with correct placeholder for catchphrase", () => {
    render(
      <ContextInput
        value=""
        generationType="catchphrase"
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    const textarea = screen.getByLabelText(/additional context/i);
    expect(textarea).toHaveAttribute(
      "placeholder",
      "e.g., 'when entering combat' or 'when celebrating victory'"
    );
  });

  it("should call onChange when text is entered", async () => {
    const user = userEvent.setup();
    render(
      <ContextInput
        value=""
        generationType="mockery"
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    const textarea = screen.getByLabelText(/additional context/i);
    await user.type(textarea, "test context");

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should call onKeyDown when key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <ContextInput
        value=""
        generationType="mockery"
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    const textarea = screen.getByLabelText(/additional context/i);
    await user.type(textarea, "{Control>}{Enter}");

    expect(mockOnKeyDown).toHaveBeenCalled();
  });

  it("should display the helper text", () => {
    render(
      <ContextInput
        value=""
        generationType="mockery"
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    expect(screen.getByText(/press ctrl\+enter to generate/i)).toBeInTheDocument();
  });

  it("should display the current value", () => {
    render(
      <ContextInput
        value="existing context"
        generationType="mockery"
        onChange={mockOnChange}
        onKeyDown={mockOnKeyDown}
      />
    );

    expect(screen.getByDisplayValue("existing context")).toBeInTheDocument();
  });
});
