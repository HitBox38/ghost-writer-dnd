/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerationTypeSelector } from "../generation-type-selector";

describe("GenerationTypeSelector", () => {
  const mockOnChange = vi.fn();

  it("should render both tab options", () => {
    render(<GenerationTypeSelector value="mockery" onChange={mockOnChange} />);

    expect(screen.getByRole("tab", { name: /combat quips/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /catchphrases/i })).toBeDefined();
  });

  it("should highlight mockery tab when selected", () => {
    render(<GenerationTypeSelector value="mockery" onChange={mockOnChange} />);

    const mockeryTab = screen.getByRole("tab", { name: /combat quips/i });
    expect(mockeryTab).toHaveAttribute("data-state", "active");
  });

  it("should highlight catchphrase tab when selected", () => {
    render(<GenerationTypeSelector value="catchphrase" onChange={mockOnChange} />);

    const catchphraseTab = screen.getByRole("tab", { name: /catchphrases/i });
    expect(catchphraseTab).toHaveAttribute("data-state", "active");
  });

  it("should call onChange when tab is clicked", async () => {
    const user = userEvent.setup();
    render(<GenerationTypeSelector value="mockery" onChange={mockOnChange} />);

    await user.click(screen.getByRole("tab", { name: /catchphrases/i }));

    expect(mockOnChange).toHaveBeenCalledWith("catchphrase");
  });
});
