import { create } from "zustand";
import type { CharacterProfile } from "@/lib/types";

export type CharacterDraft = Pick<
  CharacterProfile,
  | "name"
  | "race"
  | "class"
  | "level"
  | "backstory"
  | "appearance"
  | "worldSetting"
  | "characterSheetMetadata"
  | "characterSheet"
  | "portrait"
>;
export const BLANK_CHARACTER: CharacterDraft = {
  name: "",
  race: "",
  class: "",
  level: 1,
  backstory: "",
  appearance: "",
  worldSetting: "",
};
interface DraftStore {
  drafts: Record<string, CharacterDraft>;
  saveDraft: (id: string, draft: CharacterDraft) => void;
  discardDraft: (id: string) => void;
  reset: () => void;
}
export const useCharacterDraftStore = create<DraftStore>((set) => ({
  drafts: {},
  saveDraft: (id, draft) => set((state) => ({ drafts: { ...state.drafts, [id]: draft } })),
  discardDraft: (id) =>
    set((state) => {
      const drafts = { ...state.drafts };
      delete drafts[id];
      return { drafts };
    }),
  reset: () => set({ drafts: {} }),
}));
