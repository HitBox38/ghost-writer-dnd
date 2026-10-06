"use client";

import { ResultsToolbar } from "@/app/(main)/generate/components/results-display/components/results-toolbar";
import { ResultsList } from "@/app/(main)/generate/components/results-display/components/results-list";
import { useResultsDisplay } from "@/app/(main)/generate/components/results-display/hooks/use-results-display";
export const ResultsDisplay = (props: Parameters<typeof useResultsDisplay>[0]) => {
  const state = useResultsDisplay(props);
  return (
    <>
      <ResultsToolbar state={state} />
      <ResultsList state={state} />
    </>
  );
};
