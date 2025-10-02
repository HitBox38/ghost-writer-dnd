import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsDisplay } from "../results-display";
import type { GenerationResult } from "@/lib/types";

describe("ResultsDisplay", () => {
  const mockResults: GenerationResult[] = [
    { id: "1", text: "Test result 1" },
    { id: "2", text: "Test result 2" },
    { id: "3", text: "Test result 3" },
  ];

  const mockOnToggleFavorite = vi.fn();
  const mockOnCopy = vi.fn();

  it("should render empty state when no results", () => {
    render(
      <ResultsDisplay
        results={[]}
        favorites={new Set()}
        onToggleFavorite={mockOnToggleFavorite}
        onCopy={mockOnCopy}
      />
    );

    expect(screen.getByText(/no results yet/i)).toBeDefined();
    expect(screen.getByText(/configure your settings and click generate/i)).toBeDefined();
  });

  it("should render all results", () => {
    render(
      <ResultsDisplay
        results={mockResults}
        favorites={new Set()}
        onToggleFavorite={mockOnToggleFavorite}
        onCopy={mockOnCopy}
      />
    );

    expect(screen.getByText("Test result 1")).toBeDefined();
    expect(screen.getByText("Test result 2")).toBeDefined();
    expect(screen.getByText("Test result 3")).toBeDefined();
  });

  it("should display result count", () => {
    render(
      <ResultsDisplay
        results={mockResults}
        favorites={new Set()}
        onToggleFavorite={mockOnToggleFavorite}
        onCopy={mockOnCopy}
      />
    );

    expect(screen.getByText("3 results")).toBeDefined();
  });

  it('should display singular "result" for single result', () => {
    render(
      <ResultsDisplay
        results={[mockResults[0]]}
        favorites={new Set()}
        onToggleFavorite={mockOnToggleFavorite}
        onCopy={mockOnCopy}
      />
    );

    expect(screen.getByText("1 result")).toBeDefined();
  });

  it("should call onToggleFavorite when favorite button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ResultsDisplay
        results={mockResults}
        favorites={new Set()}
        onToggleFavorite={mockOnToggleFavorite}
        onCopy={mockOnCopy}
      />
    );

    const favoriteButtons = screen.getAllByRole("button", { name: /favorite/i });
    await user.click(favoriteButtons[0]);

    expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockResults[0]);
  });

  it("should call onCopy when copy button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ResultsDisplay
        results={mockResults}
        favorites={new Set()}
        onToggleFavorite={mockOnToggleFavorite}
        onCopy={mockOnCopy}
      />
    );

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });
    await user.click(copyButtons[0]);

    expect(mockOnCopy).toHaveBeenCalledWith("Test result 1");
  });

  it("should show favorited state for favorited results", () => {
    const favorites = new Set(["1", "3"]);
    render(
      <ResultsDisplay
        results={mockResults}
        favorites={favorites}
        onToggleFavorite={mockOnToggleFavorite}
        onCopy={mockOnCopy}
      />
    );

    const favoriteButtons = screen.getAllByRole("button", { name: /favorite/i });
    expect(favoriteButtons).toHaveLength(3);
  });
});
