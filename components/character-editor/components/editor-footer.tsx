"use client";

import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
import { Button } from "@/components/ui/button";
export const EditorFooter = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const { dirty, unloadBlocked, setPendingLeave, character, leave, uploading } = state;
  return (
    <footer className="editor-footer">
      {dirty && unloadBlocked && (
        <div className="refresh-warning" role="alert">
          <p>You have unsaved changes. Save them, or discard them to refresh this page.</p>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setPendingLeave({
                kind: "reload",
              })
            }
          >
            Discard and refresh
          </Button>
        </div>
      )}
      <span>
        {dirty ? "Unsaved changes" : character ? "All changes saved" : "Name is all you need"}
      </span>
      <div>
        <Button type="button" variant="ghost" onClick={leave}>
          Cancel
        </Button>
        <Button type="submit" disabled={!!uploading}>
          {character ? "Save changes" : "Create character"}
        </Button>
      </div>
    </footer>
  );
};
