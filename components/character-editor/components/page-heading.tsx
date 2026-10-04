"use client";

import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export const PageHeading = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const { character, setDeleting } = state;
  return (
    <div className="page-heading">
      <div>
        <h1>{character ? "Edit character" : "Create a character"}</h1>
        <p>
          {character
            ? "Keep their voice true as the story changes."
            : "Start with a name. Add the details that make their voice their own."}
        </p>
      </div>
      {character && (
        <Button
          type="button"
          variant="ghost"
          className="icon-action delete-character"
          aria-label="Delete character"
          title="Delete character"
          onClick={() => setDeleting(true)}
        >
          <Trash2 size={18} />
        </Button>
      )}
    </div>
  );
};
