"use client";

import { LoaderCircle, Feather } from "lucide-react";
import type { useResultsDisplay } from "@/app/(main)/generate/components/results-display/hooks/use-results-display";
export const GenerationContext = ({ state }: { state: ReturnType<typeof useResultsDisplay> }) => {
  const { isGenerating, pendingCount, resultType, characterName, results, resultContext } = state;
  return (
    <div className="generation-context">
      <div className="generation-context-label">
        {isGenerating ? (
          <LoaderCircle size={15} className="loading-icon" aria-hidden="true" />
        ) : (
          <Feather size={15} aria-hidden="true" />
        )}
        <span>
          {isGenerating
            ? `Writing ${pendingCount} lines…`
            : `${resultType === "mockery" ? "Combat quips" : "Catchphrases"}${characterName ? ` for ${characterName}` : ""}`}
        </span>
      </div>
      {results.length > 0 &&
        (resultContext ? (
          <details className="saved-scene generation-scene">
            <summary>Scene used for these lines</summary>
            <p>{resultContext}</p>
          </details>
        ) : (
          <p>Inspired by your character.</p>
        ))}
    </div>
  );
};
