import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MainNavigation } from "../main-navigation";
import { usePathname } from "next/navigation";
it.each([
  ["/generate", "Write"],
  ["/favorites", "Saved lines"],
])("marks the active page for %s", (path, label) => {
  vi.mocked(usePathname).mockReturnValue(path);
  render(<MainNavigation />);
  expect(screen.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
  expect(screen.getAllByRole("link")).toHaveLength(2);
});
