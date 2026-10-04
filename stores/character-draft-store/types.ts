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
export interface DraftStore {
  drafts: Record<string, CharacterDraft>;
  saveDraft: (id: string, draft: CharacterDraft) => void;
  discardDraft: (id: string) => void;
  reset: () => void;
}
