"use client";

import { SheetControls } from "@/components/character-editor/components/sheet-controls";
import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
export const CharacterSheetField = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const { uploading } = state;
  return (
    <div className="sheet-row" aria-busy={uploading === "characterSheet"}>
      <div>
        <label htmlFor="character-sheet">Character sheet</label>
        <p className="field-help">
          Optional PDF, up to 5 MB. Used as extra context when generating.
        </p>
      </div>
      <SheetControls state={state} />
    </div>
  );
};
