import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { readPortrait, readCharacterSheet } from "@/lib/character-files";
import { copyLine } from "@/lib/clipboard";
import { toast } from "sonner";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
beforeEach(() => vi.clearAllMocks());
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("rejects unsupported and oversized portraits before decoding", async () => {
  await expect(readPortrait(new File(["x"], "bad.svg", { type: "image/svg+xml" }))).rejects.toThrow(
    "JPG",
  );
  await expect(
    readPortrait(
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }),
    ),
  ).rejects.toThrow("5 MB");
});
it("rejects unreadable and oversized decoded images", async () => {
  vi.stubGlobal(
    "createImageBitmap",
    vi
      .fn()
      .mockRejectedValueOnce(new Error("decode"))
      .mockResolvedValueOnce({ width: 10000, height: 10000, close: vi.fn() }),
  );
  const file = new File(["x"], "image.png", { type: "image/png" });
  await expect(readPortrait(file)).rejects.toThrow("couldn't be read");
  await expect(readPortrait(file)).rejects.toThrow("30 megapixels");
});
it("resizes a portrait to 512px, encodes it, and releases the bitmap", async () => {
  const close = vi.fn(),
    draw = vi.fn();
  const bitmap = { width: 2048, height: 1024, close };
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap));
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: draw,
  } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/webp;base64,AAAA");
  const image = await readPortrait(new File(["x"], "image.png", { type: "image/png" }));
  expect(draw).toHaveBeenCalledWith(bitmap, 0, 0, 512, 256);
  expect(image).toBe("data:image/webp;base64,AAAA");
  expect(close).toHaveBeenCalled();
});
it("reports unavailable canvas support and releases the bitmap", async () => {
  const close = vi.fn();
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue({ width: 100, height: 100, close }));
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  await expect(readPortrait(new File(["x"], "image.png", { type: "image/png" }))).rejects.toThrow(
    "aren't supported",
  );
  expect(close).toHaveBeenCalled();
});
it("validates PDF type and size and reads valid sheets", async () => {
  await expect(
    readCharacterSheet(new File(["x"], "bad.txt", { type: "text/plain" })),
  ).rejects.toThrow("PDF");
  await expect(
    readCharacterSheet(
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.pdf", { type: "application/pdf" }),
    ),
  ).rejects.toThrow("5 MB");
  expect(
    await readCharacterSheet(new File(["%PDF"], "sheet.pdf", { type: "application/pdf" })),
  ).toMatch(/^data:application\/pdf;base64,/);
});
it("reports clipboard success only after writing succeeds and offers recovery on failure", async () => {
  const writeText = vi
    .fn()
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(new Error("denied"));
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  expect(await copyLine("A line")).toBe(true);
  expect(toast.success).toHaveBeenCalledWith("Copied to clipboard");
  expect(await copyLine("Another line")).toBe(false);
  expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Select the line"));
});
