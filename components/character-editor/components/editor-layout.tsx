"use client";

import { PageHeading } from "@/components/character-editor/components/page-heading";
import { EditorFooter } from "@/components/character-editor/components/editor-footer";
import { EditorDescriptions } from "@/components/character-editor/components/editor-descriptions";
import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
import { EditorIdentity } from "@/components/character-editor/components/editor-identity";
import { CharacterSheetField } from "@/components/character-editor/components/character-sheet-field";
import { ArrowLeft } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
export const EditorLayout = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const {
    leave,
    character,
    setDeleting,
    submit,
    uploading,
    error,
    setPendingLeave,
    pendingLeave,
    discardDraft,
    draftId,
    dirtyRef,
    router,
    deleting,
    deleteCharacter,
  } = state;
  return (
    <div className="character-editor">
      <button type="button" className="text-action back-link" onClick={leave}>
        <ArrowLeft size={16} />
        Back to workspace
      </button>
      <PageHeading state={state} />
      <form onSubmit={submit}>
        <EditorIdentity state={state} />
        <EditorDescriptions state={state} />
        <p className="field-help backstory-help">
          A few specific details go further than a complete biography. Habits, beliefs, grudges, and
          favorite expressions all help.
        </p>
        <CharacterSheetField state={state} />
        {uploading === "portrait" && (
          <p className="status-note" role="status">
            Preparing attachment…
          </p>
        )}
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
        <EditorFooter state={state} />
      </form>
      <ConfirmDialog
        open={!!pendingLeave}
        onOpenChange={(open) => {
          if (!open) setPendingLeave(null);
        }}
        title="Discard unsaved changes?"
        description={
          pendingLeave?.kind === "reload"
            ? "Refreshing will discard your unsaved edits. Stay here to keep working, or discard them and refresh."
            : "Your edits haven't been saved to the character. Stay here to keep working, or discard them and leave."
        }
        action={pendingLeave?.kind === "reload" ? "Discard and refresh" : "Discard changes"}
        onConfirm={() => {
          discardDraft(draftId);
          dirtyRef.current = false;
          if (pendingLeave?.kind === "reload") window.location.reload();
          else router.push(pendingLeave?.href || "/generate");
        }}
      />
      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        title={`Delete ${character?.name}?`}
        description="This removes the character and all their saved lines. Export a backup from Settings first if you want to keep a copy."
        action="Delete character"
        onConfirm={deleteCharacter}
      />
    </div>
  );
};
