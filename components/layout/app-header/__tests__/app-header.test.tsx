import { expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { AppHeader } from "@/components/layout/app-header";
it("links the workspace, dedicated settings, and skip navigation", () => {
  render(<AppHeader />);
  expect(
    screen.getByRole("link", {
      name: "Ghost Writer",
    }),
  ).toHaveAttribute("href", "/generate");
  expect(
    within(
      screen.getByRole("navigation", {
        name: "Main navigation",
      }),
    ).getByRole("link", {
      name: "Settings",
    }),
  ).toHaveAttribute("href", "/settings/connections");
  expect(
    screen.getByRole("link", {
      name: "Skip to content",
    }),
  ).toHaveAttribute("href", "#main-content");
});
