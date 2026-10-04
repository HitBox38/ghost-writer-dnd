import { Feather } from "lucide-react";
import { SceneStarters } from "@/app/(main)/generate/components/scene-starters";
import type { useResultsDisplay } from "../hooks/use-results-display";

export const EmptyResults = ({ state }: { state: ReturnType<typeof useResultsDisplay> }) => (
  <div className="empty-results">
    <span className="empty-response-mark" aria-hidden="true">
      <Feather size={24} />
    </span>
    <h3>A voice for the moment.</h3>
    <p>
      {state.characterName ? `${state.characterName} has something to say. ` : ""}
      Set your own scene, or start with one of these.
    </p>
    {state.onChooseScene && (
      <SceneStarters type={state.generationType} onChoose={state.onChooseScene} />
    )}
  </div>
);
