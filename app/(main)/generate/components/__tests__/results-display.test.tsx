import { beforeEach, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsDisplay } from "../results-display";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { quipFixtures } from "@/tests/fixtures/characters";

beforeEach(() => useWorkspaceStore.getState().reset());
it("shows all 25 lines and sorts stably without filtering", async () => {
  const results = Array.from({ length: 25 }, (_, index) => ({
    id: String(index),
    text: `Line ${index}`,
  }));
  render(
    <ResultsDisplay
      results={results}
      favorites={new Set(["2", "4"])}
      onCopy={vi.fn()}
      onToggleFavorite={vi.fn()}
    />,
  );
  const user = userEvent.setup();
  expect(screen.getAllByRole("article")).toHaveLength(25);
  await user.click(screen.getByRole("combobox", { name: "Sort lines" }));
  await user.click(await screen.findByRole("option", { name: "Saved first" }));
  expect(
    screen
      .getAllByRole("article")
      .slice(0, 3)
      .map((article) => article.querySelector("p")?.textContent),
  ).toEqual(["Line 2", "Line 4", "Line 0"]);
  await user.click(screen.getByRole("combobox", { name: "Sort lines" }));
  await user.click(await screen.findByRole("option", { name: "Unsaved first" }));
  expect(
    screen
      .getAllByRole("article")
      .slice(-2)
      .map((article) => article.querySelector("p")?.textContent),
  ).toEqual(["Line 2", "Line 4"]);
  await user.click(screen.getByRole("combobox", { name: "Sort lines" }));
  await user.click(await screen.findByRole("option", { name: "Original order" }));
  expect(screen.getAllByRole("article")[2]).toHaveTextContent("Line 2");
});
it("exposes visible save and copy actions and a pressed saved state", async () => {
  const save = vi.fn(),
    copy = vi.fn();
  render(
    <ResultsDisplay
      results={quipFixtures.slice(0, 2)}
      favorites={new Set([quipFixtures[1].id])}
      onCopy={copy}
      onToggleFavorite={save}
    />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Save" }));
  expect(save).toHaveBeenCalledWith(quipFixtures[0]);
  await user.click(within(screen.getAllByRole("article")[0]).getByRole("button", { name: "Copy" }));
  expect(copy).toHaveBeenCalledWith(quipFixtures[0].text);
  expect(
    within(screen.getAllByRole("article")[0]).getByRole("button", { name: "Copied" }),
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true");
});
it("renders formatted dialogue and only confirms successful copies", async () => {
  const copy = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  render(
    <ResultsDisplay
      results={[{ id: "formatted", text: "Your **confidence** is doing all the work." }]}
      favorites={new Set()}
      onCopy={copy}
      onToggleFavorite={vi.fn()}
    />,
  );
  const article = screen.getByRole("article");
  expect(within(article).getByText("confidence")).toBeVisible();
  expect(article).not.toHaveTextContent("**");
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Copy" }));
  expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Copy" }));
  expect(await screen.findByRole("button", { name: "Copied" })).toBeVisible();
});
it("keeps the selected layout when scene visibility changes", async () => {
  render(
    <ResultsDisplay
      results={quipFixtures}
      favorites={new Set()}
      onCopy={vi.fn()}
      onToggleFavorite={vi.fn()}
    />,
  );
  await userEvent.setup().click(screen.getByRole("button", { name: "List" }));
  act(() => useWorkspaceStore.getState().setSceneOpen(false));
  expect(useWorkspaceStore.getState().layout).toBe("list");
});
it("explains how to fill the empty workspace", () => {
  render(
    <ResultsDisplay
      results={[]}
      favorites={new Set()}
      onCopy={vi.fn()}
      onToggleFavorite={vi.fn()}
    />,
  );
  expect(screen.getByRole("heading", { name: "A voice for the moment." })).toBeVisible();
});
it("drafts one placeholder per requested line while the first generation runs", () => {
  const { container } = render(
    <ResultsDisplay
      results={[]}
      favorites={new Set()}
      onCopy={vi.fn()}
      onToggleFavorite={vi.fn()}
      isGenerating
      pendingCount={25}
    />,
  );
  expect(screen.queryByRole("heading", { name: "A voice for the moment." })).toBeNull();
  expect(screen.queryAllByRole("article")).toHaveLength(0);
  expect(container.querySelectorAll(".draft-entry")).toHaveLength(25);
  expect(container.querySelector(".generation-progress")).toHaveAttribute("aria-hidden", "true");
});
it("keeps existing lines usable but dimmed while regenerating", () => {
  const { container } = render(
    <ResultsDisplay
      results={quipFixtures}
      favorites={new Set()}
      onCopy={vi.fn()}
      onToggleFavorite={vi.fn()}
      isGenerating
    />,
  );
  expect(screen.getAllByRole("article")).toHaveLength(quipFixtures.length);
  expect(container.querySelector(".line-collection")).toHaveAttribute("data-stale");
  expect(container.querySelector(".draft-entry")).toBeNull();
});
it("animates lines in only when a generation finishes", () => {
  const props = { favorites: new Set<string>(), onCopy: vi.fn(), onToggleFavorite: vi.fn() };
  const { container, rerender } = render(<ResultsDisplay {...props} results={quipFixtures} />);
  const collection = () => container.querySelector(".line-collection");
  expect(collection()).not.toHaveAttribute("data-arrival");
  rerender(<ResultsDisplay {...props} results={[...quipFixtures].reverse()} />);
  expect(collection()).not.toHaveAttribute("data-arrival");
  rerender(<ResultsDisplay {...props} results={quipFixtures} isGenerating />);
  rerender(<ResultsDisplay {...props} results={quipFixtures.slice(0, 2)} />);
  expect(collection()).toHaveAttribute("data-arrival");
  expect(collection()).not.toHaveAttribute("data-stale");
});
