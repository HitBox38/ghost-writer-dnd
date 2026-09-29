import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoCharacterState } from "../no-character-state";
it("provides an actionable empty state without a portrait placeholder", () => {
  render(<NoCharacterState />);
  expect(screen.getByRole("link", { name: "Create your first character" })).toHaveAttribute(
    "href",
    "/characters/new",
  );
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Every character has a voice.",
  );
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});
