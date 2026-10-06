import type { GenerationResult, GenerationType } from "@/lib/types";
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
export interface WorkspaceStore {
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
