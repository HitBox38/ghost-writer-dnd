import { afterEach, expect, it, vi } from "vitest";
import { createPdfSource } from "../helpers";

afterEach(() => vi.restoreAllMocks());

it("allocates only for subscribers and releases the URL after the last subscriber leaves", () => {
  const allocate = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:shared-pdf");
  const release = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const source = createPdfSource("JVBERg==");
  expect(allocate).not.toHaveBeenCalled();
  expect(source.getServerSnapshot()).toBeUndefined();
  const notify = vi.fn();
  const unsubscribe = source.subscribe(notify);
  const secondUnsubscribe = source.subscribe(vi.fn());
  expect(allocate).toHaveBeenCalledTimes(1);
  expect(notify).toHaveBeenCalledTimes(1);
  expect(source.getSnapshot()).toBe(source.getSnapshot());
  unsubscribe();
  expect(release).not.toHaveBeenCalled();
  secondUnsubscribe();
  expect(release).toHaveBeenCalledWith("blob:shared-pdf");
  expect(source.getSnapshot()).toBeUndefined();
});
