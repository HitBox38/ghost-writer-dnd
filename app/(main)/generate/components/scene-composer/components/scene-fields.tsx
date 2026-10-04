"use client";

import { AiSettings } from "@/app/(main)/generate/components/scene-composer/components/ai-settings";
import { FileText, UserRound } from "lucide-react";
import { SidebarContent } from "@/components/ui/sidebar";
import { PdfViewer } from "@/components/pdf-viewer";
import { type GenerationType } from "@/lib/types";
import type { useSceneComposer } from "@/app/(main)/generate/components/scene-composer/hooks/use-scene-composer";
export const SceneFields = ({ state }: { state: ReturnType<typeof useSceneComposer> }) => {
  const { generationType, generation, contextRef, context, resultCount } = state;
  return (
    <SidebarContent className="scene-fields" role="region" aria-label="Scene fields" tabIndex={0}>
      <fieldset>
        <legend>What are we writing?</legend>
        <div className="segmented-control">
          {(
            [
              ["mockery", "Combat quips"],
              ["catchphrase", "Catchphrases"],
            ] as const
          ).map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={generationType === value}
              onClick={() => generation.setGenerationType(value as GenerationType)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="scene-context">What&apos;s happening?</label>
        <div className="scene-prompt">
          <textarea
            ref={contextRef}
            id="scene-context"
            rows={5}
            value={context}
            onChange={(event) => generation.setContext(event.target.value)}
            placeholder="A pompous knight challenges you to a duel. Your party is watching."
          />
          <div className="scene-context-sources" aria-label="Context included">
            <span className="context-chip">
              <UserRound size={13} aria-hidden="true" />
              {generation.activeCharacter?.name}
            </span>
            {generation.activeCharacter?.characterSheet && (
              <PdfViewer
                sheet={generation.activeCharacter.characterSheet}
                fileName={generation.activeCharacter.characterSheetMetadata?.name}
                trigger={
                  <button
                    type="button"
                    className="context-chip attachment-chip"
                    title="View character sheet"
                  >
                    <FileText size={13} aria-hidden="true" />
                    <span>
                      {generation.activeCharacter.characterSheetMetadata?.name ||
                        "Character sheet.pdf"}
                    </span>
                    <span className="attachment-chip-type">PDF</span>
                  </button>
                }
              />
            )}
          </div>
        </div>
        <p className="field-help">Add a moment, or leave blank to draw from your character.</p>
      </div>
      <div className="count-row">
        <label htmlFor="result-count">Number of lines</label>
        <input
          id="result-count"
          type="number"
          min={1}
          max={25}
          required
          value={Number.isNaN(resultCount) ? "" : resultCount}
          onChange={(event) => generation.setResultCount(event.target.valueAsNumber)}
        />
      </div>
      <AiSettings state={state} />
    </SidebarContent>
  );
};
