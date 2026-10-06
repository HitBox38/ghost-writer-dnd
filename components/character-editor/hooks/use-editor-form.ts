"use client";

import { useUnsavedChanges } from "./use-unsaved-changes";
import type { CharacterProfile } from "@/lib/types";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCharacterStore } from "@/stores/character-store";
import { useCharacterDraftStore, type CharacterDraft } from "@/stores/character-draft-store";
import { readCharacterSheet, readPortrait } from "@/lib/character-files";
import { characterSheetSize } from "@/lib/pdf";
import { toast } from "sonner";
import { getDraft } from "@/components/character-editor/helpers";
export const useEditorForm = ({ character }: { character?: CharacterProfile }) => {
  const router = useRouter();
  const draftId = character?.id ?? "new";
  const { saveDraft, discardDraft } = useCharacterDraftStore();
  const [initial] = useState(() => getDraft(character));
  const [form, setForm] = useState(
    () => useCharacterDraftStore.getState().drafts[draftId] ?? initial,
  );
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"portrait" | "characterSheet" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const { dirtyRef, pendingLeave, setPendingLeave, unloadBlocked } = useUnsavedChanges(dirty);
  const sheetSize =
    form.characterSheetMetadata?.size ??
    (form.characterSheet ? characterSheetSize(form.characterSheet) : undefined);
  const portraitInput = useRef<HTMLInputElement>(null);
  const sheetInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const patch = (updates: Partial<CharacterDraft>) => {
    const next = {
      ...(useCharacterDraftStore.getState().drafts[draftId] ?? form),
      ...updates,
    };
    setForm(next);
    saveDraft(draftId, next);
  };
  const update = <K extends keyof CharacterDraft>(field: K, value: CharacterDraft[K]) => {
    patch({
      [field]: value,
    });
  };
  const leave = () => {
    if (dirty)
      setPendingLeave({
        kind: "navigate",
        href: "/generate",
      });
    else router.push("/generate");
  };
  const upload = async (file: File | undefined, kind: "portrait" | "characterSheet") => {
    if (!file || uploading) return;
    setUploading(kind);
    setError(null);
    try {
      if (kind === "portrait") update("portrait", await readPortrait(file));
      else {
        const characterSheet = await readCharacterSheet(file);
        patch({
          characterSheet,
          characterSheetMetadata: {
            name: file.name,
            size: file.size,
            uploadedAt: Date.now(),
          },
        });
      }
    } catch (problem) {
      setError(
        problem instanceof Error ? problem.message : "Couldn't read the file. Try another file.",
      );
    }
    setUploading(null);
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (uploading) return;
    setError(null);
    if (!form.name.trim()) {
      setError("Give your character a name.");
      nameInput.current?.focus();
      return;
    }
    if (!Number.isInteger(form.level) || form.level < 1 || form.level > 20) {
      setError("Level must be a whole number from 1 to 20.");
      return;
    }
    try {
      const store = useCharacterStore.getState();
      if (character)
        store.updateCharacter(character.id, {
          ...form,
          name: form.name.trim(),
        });
      else
        store.addCharacter({
          ...form,
          name: form.name.trim(),
        });
      discardDraft(draftId);
      dirtyRef.current = false;
      toast.success(character ? "Character updated" : "Character created");
      router.push("/generate");
    } catch {
      setError(
        "Couldn't save your character. Browser storage may be full. Your draft is still here; try a smaller attachment or export a backup before freeing space.",
      );
    }
  };
  const deleteCharacter = () => {
    if (!character) return;
    try {
      useCharacterStore.getState().deleteCharacter(character.id);
      discardDraft(draftId);
      dirtyRef.current = false;
      toast.success("Character deleted");
      router.push("/generate");
    } catch {
      setDeleting(false);
      setError("Couldn't delete this character. Please try again.");
    }
  };
  return {
    leave,
    character,
    setDeleting,
    submit,
    nameInput,
    form,
    update,
    uploading,
    portraitInput,
    upload,
    sheetSize,
    patch,
    sheetInput,
    error,
    dirty,
    unloadBlocked,
    setPendingLeave,
    pendingLeave,
    discardDraft,
    draftId,
    dirtyRef,
    router,
    deleting,
    deleteCharacter,
  };
};
