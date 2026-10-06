import { storage } from "@/lib/storage";

export const readPortrait = async (file: File): Promise<string> => {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPG, PNG, or WebP image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose an image smaller than 5 MB.");
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("This image couldn't be read. Try another file.");
  });
  try {
    if (bitmap.width * bitmap.height > 30_000_000)
      throw new Error("This image is too large. Resize it to under 30 megapixels.");
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image uploads aren't supported in this browser.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.82);
  } finally {
    bitmap.close();
  }
};

export const readCharacterSheet = async (file: File) => {
  if (file.type !== "application/pdf") throw new Error("Choose a PDF character sheet.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose a PDF smaller than 5 MB.");
  return storage.fileToBase64(file);
};
