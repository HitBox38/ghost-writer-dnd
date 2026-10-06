/** Older saved characters may contain raw base64 instead of a data URL. */
export const characterSheetBlob = (sheet: string): Blob => {
  const base64 = sheet.startsWith("data:") ? sheet.slice(sheet.indexOf(",") + 1) : sheet;
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  if (!bytes.length) throw new Error("Empty PDF");
  return new Blob([bytes], { type: "application/pdf" });
};

/** Recover the byte count when an older attachment has no saved file metadata. */
export const characterSheetSize = (sheet: string): number | undefined => {
  const base64 = (sheet.startsWith("data:") ? sheet.slice(sheet.indexOf(",") + 1) : sheet).replace(
    /\s/g,
    "",
  );
  if (!base64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length % 4 === 1)
    return undefined;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  if (padding && base64.length % 4 !== 0) return undefined;
  return Math.floor((base64.length * 3) / 4) - padding;
};
