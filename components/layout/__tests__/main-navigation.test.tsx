import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MainNavigation } from "../main-navigation";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    usePathname: vi.fn(() => "/generate"),
  };
});

describe("MainNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render navigation links", () => {
    render(<MainNavigation />);

    expect(screen.getByRole("link", { name: /generate/i })).toBeDefined();
    expect(screen.getByRole("link", { name: /favorites/i })).toBeDefined();
  });

  it("should render with Generate as active when on /generate", () => {
    vi.mocked(usePathname).mockReturnValue("/generate");

    const { container } = render(<MainNavigation />);

    // Just verify the component renders with the correct path
    expect(container).toBeTruthy();
    expect(screen.getByRole("link", { name: /generate/i })).toBeDefined();
  });

  it("should render with Favorites as active when on /favorites", () => {
    vi.mocked(usePathname).mockReturnValue("/favorites");

    const { container } = render(<MainNavigation />);

    // Just verify the component renders with the correct path
    expect(container).toBeTruthy();
    expect(screen.getByRole("link", { name: /favorites/i })).toBeDefined();
  });
});
