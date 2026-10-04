import type { WorkspaceStore } from "./types";
import { EMPTY_SESSION } from "./constants";
import { create } from "zustand";
import { useSettingsStore } from "@/stores/settings-store";
import { toast } from "sonner";
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  sessions: {},
  layout: "grid",
  sort: "original",
  sceneOpen: true,
  updateSession: (id, patch) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [id]: {
          ...EMPTY_SESSION,
          ...state.sessions[id],
          ...patch,
        },
      },
    })),
  setLayout: (layout) => {
    try {
      useSettingsStore.getState().updateSettings({
        resultLayout: layout,
      });
      set({
        layout,
      });
    } catch {
      toast.error("Couldn't save the layout preference. Check browser storage.");
    }
  },
  setSort: (sort) =>
    set({
      sort,
    }),
  setSceneOpen: (sceneOpen) =>
    set({
      sceneOpen,
    }),
  reset: () =>
    set({
      sessions: {},
      layout: useSettingsStore.getState().settings.resultLayout ?? "grid",
      sort: "original",
      sceneOpen: true,
    }),
}));
export type { ResultLayout } from "./types";
export type { ResultSort } from "./types";
export type { WritingSession } from "./types";
export { EMPTY_SESSION } from "./constants";
