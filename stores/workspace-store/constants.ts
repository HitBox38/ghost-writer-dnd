import type { WritingSession } from "./types";
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
