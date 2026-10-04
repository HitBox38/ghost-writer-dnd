import { expect, it } from "vitest";
import { characterSheetBlob, characterSheetSize } from "@/lib/pdf";

it.each(["JVBERg==", "data:application/pdf;base64,JVBERg=="])(
  "reads a stored PDF (%s)",
  async (sheet) => {
    const blob = characterSheetBlob(sheet);
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBe(4);
    expect(characterSheetSize(sheet)).toBe(blob.size);
    const reader = new FileReader();
    const text = new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsText(blob);
    expect(await text).toBe("%PDF");
  },
);

it.each(["", "invalid!"])("rejects unreadable PDF data", (sheet) => {
  expect(() => characterSheetBlob(sheet)).toThrow();
  expect(characterSheetSize(sheet)).toBeUndefined();
});

it.each([
  ["JVBE", 3],
  ["JVBEUg==", 4],
  ["JVBERg=", undefined],
  ["A", undefined],
] as const)("handles legacy padding correctly (%s)", (sheet, size) => {
  expect(characterSheetSize(sheet)).toBe(size);
});
