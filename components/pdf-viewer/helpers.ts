import { characterSheetBlob } from "@/lib/pdf";

type PdfSource = { url?: string; error?: string };

/** Own the object URL only while React has a committed subscriber. */
export const createPdfSource = (sheet: string) => {
  let source: PdfSource | undefined;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => source,
    getServerSnapshot: () => undefined,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      if (!source) {
        try {
          source = { url: URL.createObjectURL(characterSheetBlob(sheet)) };
        } catch {
          source = { error: "This PDF couldn't be read. Try replacing the attachment." };
        }
        listeners.forEach((notify) => notify());
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size) return;
        if (source?.url) URL.revokeObjectURL(source.url);
        source = undefined;
      };
    },
  };
};
