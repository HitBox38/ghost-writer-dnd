import { create } from "zustand";
import type { GenerationResult, GenerationType } from "@/lib/types";
import { useSettingsStore } from "./settings-store";
import { toast } from "sonner";

export type ResultLayout = "grid" | "list";
export type ResultSort = "original" | "saved" | "unsaved";
export interface WritingSession {
  context: string;
  generationType: GenerationType;
  resultCount: number;
  results: GenerationResult[];
  resultContext: string;
  resultType: GenerationType;
  isGenerating: boolean;
  requestId: string | null;
  error: string | null;
}
export const EMPTY_SESSION: WritingSession = {
  context: "",
  generationType: "mockery",
  resultCount: 5,
  results: [],
  resultContext: "",
  resultType: "mockery",
  isGenerating: false,
  requestId: null,
  error: null,
};
interface WorkspaceStore {
  sessions: Record<string, WritingSession>;
  layout: ResultLayout;
  sort: ResultSort;
  sceneOpen: boolean;
  updateSession: (id: string, patch: Partial<WritingSession>) => void;
  setLayout: (layout: ResultLayout) => void;
  setSort: (sort: ResultSort) => void;
  setSceneOpen: (open: boolean) => void;
  reset: () => void;
}
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  sessions: {},
  layout: "grid",
  sort: "original",
  sceneOpen: true,
  updateSession: (id, patch) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [id]: { ...EMPTY_SESSION, ...state.sessions[id], ...patch },
      },
    })),
  setLayout: (layout) => {
    try {
      useSettingsStore.getState().updateSettings({ resultLayout: layout });
      set({ layout });
    } catch {
      toast.error("Couldn't save the layout preference. Check browser storage.");
    }
  },
  setSort: (sort) => set({ sort }),
  setSceneOpen: (sceneOpen) => set({ sceneOpen }),
  reset: () =>
    set({
      sessions: {},
      layout: useSettingsStore.getState().settings.resultLayout ?? "grid",
      sort: "original",
      sceneOpen: true,
    }),
}));
