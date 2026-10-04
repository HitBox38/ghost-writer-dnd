"use client";

import { ResultLine } from "@/app/(main)/generate/components/results-display/components/result-line";
import { GenerationContext } from "@/app/(main)/generate/components/results-display/components/generation-context";
import { DraftLines } from "./draft-lines";
import { EmptyResults } from "./empty-results";
import type { useResultsDisplay } from "@/app/(main)/generate/components/results-display/hooks/use-results-display";
export const ResultsList = ({ state }: { state: ReturnType<typeof useResultsDisplay> }) => {
  const { results, isGenerating, layout, drafts, arrival, revealing, setRevealing, sorted } = state;
  return (
    <div className="results-scroll" role="region" aria-label="Lines list" tabIndex={0}>
      {(results.length > 0 || isGenerating) && <GenerationContext state={state} />}
      {!results.length && isGenerating ? (
        <DraftLines drafts={drafts} layout={layout} />
      ) : !results.length ? (
        <EmptyResults state={state} />
      ) : (
        <div
          key={arrival}
          className={`line-collection ${layout === "list" ? "list-layout" : ""}`}
          data-arrival={revealing || undefined}
          data-stale={isGenerating || undefined}
          onAnimationEnd={(event) => {
            // Reordering re-inserts nodes and would replay the entrance, so drop it once done.
            if (
              event.animationName === "line-rise" &&
              event.target === event.currentTarget.lastElementChild
            )
              setRevealing(false);
          }}
        >
          {sorted.map((result, index) => (
            <ResultLine key={result.id} state={state} result={result} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
