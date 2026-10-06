import type { DraftStore } from "./types";

import { create } from "zustand";
export const useCharacterDraftStore = create<DraftStore>((set) => ({
  drafts: {},
  saveDraft: (id, draft) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [id]: draft,
      },
    })),
  discardDraft: (id) =>
    set((state) => {
      const drafts = {
        ...state.drafts,
      };
      delete drafts[id];
      return {
        drafts,
      };
    }),
  reset: () =>
    set({
      drafts: {},
    }),
}));
export type { CharacterDraft } from "./types";
export { BLANK_CHARACTER } from "./constants";
