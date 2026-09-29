import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "../app-header";
it("links the workspace, dedicated settings, and skip navigation", () => {
  render(<AppHeader />);
  expect(screen.getByRole("link", { name: "Ghost Writer" })).toHaveAttribute("href", "/generate");
  expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
    "href",
    "/settings/connections",
  );
  expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main-content",
  );
});
