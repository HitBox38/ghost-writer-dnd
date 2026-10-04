import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MainNavigation } from "@/components/layout/main-navigation";
import { usePathname } from "next/navigation";
it.each([
  ["/generate", "Write"],
  ["/favorites", "Saved lines"],
  ["/settings", "Settings"],
  ["/settings/connections", "Settings"],
  ["/settings/appearance", "Settings"],
  ["/settings/data", "Settings"],
])("marks the active page for %s", (path, label) => {
  vi.mocked(usePathname).mockReturnValue(path);
  render(<MainNavigation />);
  expect(
    screen.getByRole("link", {
      name: label,
    }),
  ).toHaveAttribute("aria-current", "page");
  expect(screen.getAllByRole("link")).toHaveLength(3);
  expect(
    screen.getAllByRole("link").filter((link) => link.hasAttribute("aria-current")),
  ).toHaveLength(1);
});
