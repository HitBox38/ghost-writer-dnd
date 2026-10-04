import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { SavedLineDate } from "../components/saved-line-date";

afterEach(() => vi.restoreAllMocks());

it("renders a stable server placeholder and formats with the browser's locale after mount", () => {
  const format = vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("Localized day");
  const createdAt = Date.UTC(2026, 9, 4);
  expect(renderToString(<SavedLineDate createdAt={createdAt} />)).toBe(
    '<time dateTime="2026-10-04T00:00:00.000Z"></time>',
  );
  expect(format).not.toHaveBeenCalled();
  render(<SavedLineDate createdAt={createdAt} />);
  expect(screen.getByText("Localized day")).toHaveAttribute("datetime", "2026-10-04T00:00:00.000Z");
  expect(format).toHaveBeenCalledWith(undefined, { month: "short", day: "numeric" });
});
