import type { CharacterProfile } from "@/lib/types";
export interface CharacterDropdownProps {
  characters: CharacterProfile[];
  activeCharacter: CharacterProfile | null;
  onSelectCharacter: (id: string) => void;
  onCreateNew: () => void;
}
