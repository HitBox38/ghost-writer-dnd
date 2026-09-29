import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { TypedDialogue } from "../typed-dialogue";

const text = "I've heard sharper threats from a butter knife.";
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("renders plain text when not typing", () => {
  render(<TypedDialogue text={text} typing={false} />);
  expect(screen.getByText(text)).not.toHaveAttribute("data-typing");
});
it("writes the line word by word while keeping the full text in place", () => {
  const { container } = render(<TypedDialogue text={text} typing delay={100} />);
  const line = container.querySelector(".dialogue")!;
  expect(line).toHaveAttribute("data-typing");
  expect(line).toHaveTextContent(text);
  expect(line.querySelector(".untyped")).toHaveTextContent(text);
  void act(() => vi.advanceTimersByTime(300));
  const written = line.textContent!.length - line.querySelector(".untyped")!.textContent!.length;
  expect(written).toBeGreaterThan(0);
  expect(written).toBeLessThan(text.length);
  expect(line).toHaveTextContent(text);
  void act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByText(text)).not.toHaveAttribute("data-typing");
});
it("shows the full line immediately for reduced motion", () => {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce") }));
  render(<TypedDialogue text={text} typing />);
  expect(screen.getByText(text)).not.toHaveAttribute("data-typing");
});
