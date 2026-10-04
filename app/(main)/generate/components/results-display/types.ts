import type { GenerationResult, GenerationType } from "@/lib/types";
import type { CopyLineAction } from "@/components/line-message";
export interface ResultsDisplayProps {
  results: GenerationResult[];
  favorites: Set<string>;
  onToggleFavorite: (result: GenerationResult) => void;
  onCopy: CopyLineAction;
  isGenerating?: boolean;
  pendingCount?: number;
  characterName?: string;
  generationType?: GenerationType;
  resultType?: GenerationType;
  resultContext?: string;
  onChooseScene?: (scene: string) => void;
}
