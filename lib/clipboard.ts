import { toast } from "sonner";

export const copyLine = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
    return true;
  } catch {
    toast.error("Couldn't copy. Select the line and copy it manually.");
    return false;
  }
};
