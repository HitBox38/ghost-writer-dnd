import type { ReactNode } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PdfViewer } from "@/components/pdf-viewer";
vi.mock("@/components/pdf-document", () => ({
  default: ({ url, actions }: { url: string; actions: ReactNode }) => (
    <div>
      <div aria-label="PDF controls">{actions}</div>
      <div data-testid="pdf-source">{url}</div>
    </div>
  ),
}));
beforeEach(() => {
  let next = 0;
  vi.stubGlobal(
    "URL",
    class extends URL {
      static createObjectURL = vi.fn(() => `blob:pdf-${++next}`);
      static revokeObjectURL = vi.fn();
    },
  );
});
afterEach(() => vi.unstubAllGlobals());
it("creates URLs only while open, releases them, and previews a replacement", async () => {
  const user = userEvent.setup();
  const { rerender, unmount } = render(
    <PdfViewer sheet="JVBERg==" trigger={<button type="button">View PDF</button>} />,
  );
  expect(URL.createObjectURL).not.toHaveBeenCalled();
  await user.click(
    screen.getByRole("button", {
      name: "View PDF",
    }),
  );
  expect(await screen.findByTestId("pdf-source")).toHaveTextContent("blob:pdf-1");
  rerender(
    <PdfViewer
      sheet="JVBERiBuZXc="
      fileName="Replacement.pdf"
      trigger={<button type="button">View PDF</button>}
    />,
  );
  await waitFor(() => expect(screen.getByTestId("pdf-source")).toHaveTextContent("blob:pdf-2"));
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-1");
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Close",
    }),
  );
  await waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-2"));
  await user.click(
    screen.getByRole("button", {
      name: "View PDF",
    }),
  );
  await screen.findByTestId("pdf-source");
  unmount();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-3");
});
it("reports unreadable stored attachments in the modal", async () => {
  render(<PdfViewer sheet="not base64!" trigger={<button type="button">View PDF</button>} />);
  await userEvent.setup().click(
    screen.getByRole("button", {
      name: "View PDF",
    }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent("This PDF couldn't be read");
  expect(URL.createObjectURL).not.toHaveBeenCalled();
});
it("expands the viewer, exits with Escape, and resets on close without recreating the PDF", async () => {
  render(
    <PdfViewer
      sheet="JVBERg=="
      fileName="Sheet.pdf"
      trigger={<button type="button">View PDF</button>}
    />,
  );
  const user = userEvent.setup();
  await user.click(
    screen.getByRole("button", {
      name: "View PDF",
    }),
  );
  await screen.findByTestId("pdf-source");
  const dialog = screen.getByRole("dialog");
  const download = within(dialog).getByRole("link", {
    name: "Download PDF",
  });
  expect(download).toHaveAttribute("download", "Sheet.pdf");
  expect(download.closest('[aria-label="PDF controls"]')).not.toBeNull();
  await user.click(
    within(dialog).getByRole("button", {
      name: "Full screen",
    }),
  );
  expect(dialog).toHaveAttribute("data-fullscreen", "true");
  expect(
    within(dialog).getByRole("button", {
      name: "Exit full screen",
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await user.keyboard("{Escape}");
  expect(dialog).toBeVisible();
  expect(dialog).not.toHaveAttribute("data-fullscreen");
  expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
  await user.click(
    within(dialog).getByRole("button", {
      name: "Full screen",
    }),
  );
  await user.click(
    within(dialog).getByRole("button", {
      name: "Exit full screen",
    }),
  );
  expect(dialog).not.toHaveAttribute("data-fullscreen");
  await user.click(
    within(dialog).getByRole("button", {
      name: "Full screen",
    }),
  );
  await user.click(
    within(dialog).getByRole("button", {
      name: "Close",
    }),
  );
  await waitFor(() => expect(dialog).not.toBeInTheDocument());
  await user.click(
    screen.getByRole("button", {
      name: "View PDF",
    }),
  );
  expect(screen.getByRole("dialog")).not.toHaveAttribute("data-fullscreen");
});
