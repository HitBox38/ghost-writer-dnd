"use client";
import { useState } from "react";
import { LayoutGrid, List, LoaderCircle, Feather } from "lucide-react";
import { FolioSelect } from "@/components/folio-select";
import { Message, MessageContent, MessageToolbar } from "@/components/ai-elements/message";
import { LineActions, type CopyLineAction } from "@/components/line-message";
import type { GenerationResult, GenerationType } from "@/lib/types";
import { useWorkspaceStore, type ResultSort } from "@/stores/workspace-store";
import { TypedDialogue } from "./typed-dialogue";
import { SceneStarters } from "./scene-starters";
interface ResultsDisplayProps {
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
const MAX_LINES = 25;
export function ResultsDisplay({
  results,
  favorites,
  onToggleFavorite,
  onCopy,
  isGenerating = false,
  pendingCount = 5,
  characterName,
  generationType = "mockery",
  resultType = "mockery",
  resultContext,
  onChooseScene,
}: ResultsDisplayProps) {
  const { layout, sort, setLayout, setSort } = useWorkspaceStore();
  // Only lines that arrive from a generation finishing in this view animate in;
  // sorting, remounting, or switching characters shows them instantly.
  const [previous, setPrevious] = useState({ results, isGenerating });
  const [arrival, setArrival] = useState(0);
  const [revealing, setRevealing] = useState(false);
  if (previous.results !== results || previous.isGenerating !== isGenerating) {
    if (previous.results !== results && previous.isGenerating && results.length) {
      setArrival(arrival + 1);
      setRevealing(true);
    }
    setPrevious({ results, isGenerating });
  }
  const sorted =
    sort === "original"
      ? results
      : results.toSorted(
          (a, b) =>
            (Number(favorites.has(b.id)) - Number(favorites.has(a.id))) *
            (sort === "saved" ? 1 : -1),
        );
  const drafts = Math.min(
    Math.max(Number.isInteger(pendingCount) ? pendingCount : 1, 1),
    MAX_LINES,
  );
  return (
    <>
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
                { value: "original", label: "Original order" },
                { value: "saved", label: "Saved first" },
                { value: "unsaved", label: "Unsaved first" },
              ]}
            />
          </label>
          <div className="segmented-control layout-selector" aria-label="Results layout">
            <button
              type="button"
              aria-pressed={layout === "grid"}
              onClick={() => setLayout("grid")}
            >
              <LayoutGrid size={16} />
              Grid
            </button>
            <button
              type="button"
              aria-pressed={layout === "list"}
              onClick={() => setLayout("list")}
            >
              <List size={16} />
              List
            </button>
          </div>
        </div>
        {isGenerating && <span className="generation-progress" aria-hidden="true" />}
      </div>
      <div className="results-scroll" role="region" aria-label="Lines list" tabIndex={0}>
        {(results.length > 0 || isGenerating) && (
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
        )}
        {!results.length && isGenerating ? (
          <div
            className={`line-collection draft-collection ${layout === "list" ? "list-layout" : ""}`}
            aria-hidden="true"
          >
            {Array.from({ length: drafts }, (_, index) => (
              <div
                className="draft-entry"
                key={index}
                style={{ "--index": index } as React.CSSProperties}
              >
                <span className="draft-bar" />
                <span className="draft-bar" />
                <span className="draft-bar" />
              </div>
            ))}
          </div>
        ) : !results.length ? (
          <div className="empty-results">
            <span className="empty-response-mark" aria-hidden="true">
              <Feather size={24} />
            </span>
            <h3>A voice for the moment.</h3>
            <p>
              {characterName ? `${characterName} has something to say. ` : ""}
              Set your own scene, or start with one of these.
            </p>
            {onChooseScene && <SceneStarters type={generationType} onChoose={onChooseScene} />}
          </div>
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
              <article
                className="line-entry"
                key={result.id}
                style={revealing ? ({ "--index": index } as React.CSSProperties) : undefined}
              >
                <Message from="assistant" className="line-message">
                  <MessageContent className="line-message-content">
                    <TypedDialogue
                      text={result.text}
                      typing={revealing}
                      delay={Math.min(index, 8) * 60 + 80}
                    />
                  </MessageContent>
                  <MessageToolbar className="line-message-toolbar">
                    <LineActions
                      text={result.text}
                      saved={favorites.has(result.id)}
                      onSave={() => onToggleFavorite(result)}
                      onCopy={onCopy}
                    />
                    <span className="line-number" aria-hidden="true">
                      {String(results.indexOf(result) + 1).padStart(2, "0")}
                    </span>
                  </MessageToolbar>
                </Message>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
