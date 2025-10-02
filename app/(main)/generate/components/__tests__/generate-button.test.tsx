import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerateButton } from "../generate-button";

describe("GenerateButton", () => {
  const mockOnClick = vi.fn();

  it("should render Generate button when not generating", () => {
    render(<GenerateButton isGenerating={false} hasApiKey={true} onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: /generate/i })).toBeDefined();
  });

  it("should render Generating... when generating", () => {
    render(<GenerateButton isGenerating={true} hasApiKey={true} onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: /generating/i })).toBeDefined();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(<GenerateButton isGenerating={false} hasApiKey={true} onClick={mockOnClick} />);

    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it("should be disabled when generating", () => {
    render(<GenerateButton isGenerating hasApiKey onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: /generating/i })).toBeDisabled();
  });

  it("should be disabled when no API key", () => {
    render(<GenerateButton isGenerating={false} hasApiKey={false} onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: /generate/i })).toBeDisabled();
  });

  it("should show warning message when no API key", () => {
    render(<GenerateButton isGenerating={false} hasApiKey={false} onClick={mockOnClick} />);

    expect(screen.getByText(/please configure your api key in settings/i)).toBeDefined();
  });

  it("should not show warning message when API key exists", () => {
    render(<GenerateButton isGenerating={false} hasApiKey onClick={mockOnClick} />);

    expect(screen.queryByText(/please configure your api key in settings/i)).toBeNull();
  });
});
