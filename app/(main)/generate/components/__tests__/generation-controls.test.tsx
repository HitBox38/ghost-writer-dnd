import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GenerationControls } from "../generation-controls";

describe("GenerationControls", () => {
  const mockProps = {
    generationType: "mockery" as const,
    context: "",
    provider: "openai" as const,
    model: "gpt-4",
    temperature: 0.7,
    resultCount: 5,
    isGenerating: false,
    hasApiKey: true,
    onGenerationTypeChange: vi.fn(),
    onContextChange: vi.fn(),
    onProviderChange: vi.fn(),
    onModelChange: vi.fn(),
    onTemperatureChange: vi.fn(),
    onResultCountChange: vi.fn(),
    onGenerate: vi.fn(),
    onKeyDown: vi.fn(),
  };

  it("should render all control sections", () => {
    render(<GenerationControls {...mockProps} />);

    // Check for key elements from each section
    expect(screen.getByText(/generation type/i)).toBeDefined();
    expect(screen.getByLabelText(/ai provider/i)).toBeDefined();
    expect(screen.getByText(/temperature:/i)).toBeDefined();
    expect(screen.getByText(/number of results:/i)).toBeDefined();
    expect(screen.getByLabelText(/additional context/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /generate/i })).toBeDefined();
  });

  it("should render with all props correctly", () => {
    render(<GenerationControls {...mockProps} />);

    expect(screen.getByText(/temperature: 0.70/i)).toBeDefined();
    expect(screen.getByText(/number of results: 5/i)).toBeDefined();
  });

  it("should render when generating", () => {
    render(<GenerationControls {...mockProps} isGenerating={true} />);

    expect(screen.getByRole("button", { name: /generating/i })).toBeDefined();
  });

  it("should render when no API key", () => {
    render(<GenerationControls {...mockProps} hasApiKey={false} />);

    expect(screen.getByText(/please configure your api key in settings/i)).toBeDefined();
  });
});
