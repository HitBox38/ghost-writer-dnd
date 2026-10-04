import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { useDevicePixelRatio } from "../hooks/use-device-pixel-ratio";

const PixelRatio = () => <output>{useDevicePixelRatio()}</output>;
afterEach(() => vi.unstubAllGlobals());

it("uses the stable server snapshot even when the browser has a different pixel ratio", () => {
  vi.stubGlobal("devicePixelRatio", 3);
  expect(renderToString(<PixelRatio />)).toBe("<output>1</output>");
});

it("caps rendering resolution and follows viewport changes", async () => {
  vi.stubGlobal("devicePixelRatio", 3);
  render(<PixelRatio />);
  expect(screen.getByRole("status")).toHaveTextContent("2");
  vi.stubGlobal("devicePixelRatio", 1.5);
  await act(() => window.dispatchEvent(new Event("resize")));
  expect(screen.getByRole("status")).toHaveTextContent("1.5");
});
