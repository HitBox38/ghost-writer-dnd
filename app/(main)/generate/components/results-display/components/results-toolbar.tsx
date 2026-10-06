"use client";

import { LayoutGrid, List } from "lucide-react";
import { FolioSelect } from "@/components/folio-select";
import { type ResultSort } from "@/stores/workspace-store";
import type { useResultsDisplay } from "@/app/(main)/generate/components/results-display/hooks/use-results-display";
export const ResultsToolbar = ({ state }: { state: ReturnType<typeof useResultsDisplay> }) => {
  const { isGenerating, results, sort, setSort, layout, setLayout } = state;
  return (
    <div className="results-toolbar" data-generating={isGenerating || undefined}>
      <div className="section-heading">
        <h1>Your lines</h1>
        <span className="result-count">{results.length}</span>
      </div>
      <div className="results-tools">
        <label className="sort-label">
          Sort{" "}
          <FolioSelect
            label="Sort lines"
            value={sort}
            onValueChange={(value) => setSort(value as ResultSort)}
            options={[
              {
                value: "original",
                label: "Original order",
              },
              {
                value: "saved",
                label: "Saved first",
              },
              {
                value: "unsaved",
                label: "Unsaved first",
              },
            ]}
          />
        </label>
        <div className="segmented-control layout-selector" aria-label="Results layout">
          <button type="button" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")}>
            <LayoutGrid size={16} />
            Grid
          </button>
          <button type="button" aria-pressed={layout === "list"} onClick={() => setLayout("list")}>
            <List size={16} />
            List
          </button>
        </div>
      </div>
      {isGenerating && <span className="generation-progress" aria-hidden="true" />}
    </div>
  );
};
