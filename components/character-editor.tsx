"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2, FileText, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PdfViewer } from "@/components/pdf-viewer";
import { useCharacterStore } from "@/stores/character-store";
import {
  useCharacterDraftStore,
  BLANK_CHARACTER,
  type CharacterDraft,
} from "@/stores/character-draft-store";
import { readCharacterSheet, readPortrait } from "@/lib/character-files";
import type { CharacterProfile } from "@/lib/types";
import { formatAttachmentDate, formatAttachmentSize } from "@/lib/attachment-format";
import { characterSheetSize } from "@/lib/pdf";
import { toast } from "sonner";
function getDraft(character?: CharacterProfile): CharacterDraft {
  if (!character) return BLANK_CHARACTER;
  const {
    name,
    race,
    class: characterClass,
    level,
    backstory,
    appearance,
    worldSetting,
    characterSheet,
    characterSheetMetadata,
    portrait,
  } = character;
  return {
    name,
    race,
    class: characterClass,
    level,
    backstory,
    appearance,
    worldSetting,
    characterSheet,
    characterSheetMetadata,
    portrait,
  };
}
type PendingLeave = { kind: "navigate"; href: string } | { kind: "reload" };
function EditorForm({ character }: { character?: CharacterProfile }) {
  const router = useRouter();
  const draftId = character?.id ?? "new";
  const { saveDraft, discardDraft } = useCharacterDraftStore();
  const [initial] = useState(() => getDraft(character));
  const [form, setForm] = useState(
    () => useCharacterDraftStore.getState().drafts[draftId] ?? initial,
  );
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"portrait" | "characterSheet" | null>(null);
  const [pendingLeave, setPendingLeave] = useState<PendingLeave | null>(null);
  const [unloadBlocked, setUnloadBlocked] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const sheetSize =
    form.characterSheetMetadata?.size ??
    (form.characterSheet ? characterSheetSize(form.characterSheet) : undefined);
  const portraitInput = useRef<HTMLInputElement>(null);
  const sheetInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const dirtyRef = useRef(dirty);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = true;
      // Some embedded browsers cancel unloading without displaying the native warning.
      setUnloadBlocked(true);
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);
  useEffect(() => {
    const interceptRefresh = (event: KeyboardEvent) => {
      if (!dirtyRef.current || event.defaultPrevented || event.altKey) return;
      if (
        event.key !== "F5" &&
        !((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r")
      )
        return;
      event.preventDefault();
      setPendingLeave({ kind: "reload" });
    };
    const interceptLink = (event: MouseEvent) => {
      if (
        !dirtyRef.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        (url.pathname === window.location.pathname && url.hash)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      setPendingLeave({ kind: "navigate", href: url.pathname + url.search + url.hash });
    };
    window.addEventListener("keydown", interceptRefresh);
    document.addEventListener("click", interceptLink, true);
    return () => {
      window.removeEventListener("keydown", interceptRefresh);
      document.removeEventListener("click", interceptLink, true);
    };
  }, []);
  function patch(updates: Partial<CharacterDraft>) {
    const next = { ...(useCharacterDraftStore.getState().drafts[draftId] ?? form), ...updates };
    setForm(next);
    saveDraft(draftId, next);
  }
  function update<K extends keyof CharacterDraft>(field: K, value: CharacterDraft[K]) {
    patch({ [field]: value });
  }
  function leave() {
    if (dirty) setPendingLeave({ kind: "navigate", href: "/generate" });
    else router.push("/generate");
  }
  async function upload(file: File | undefined, kind: "portrait" | "characterSheet") {
    if (!file || uploading) return;
    setUploading(kind);
    setError(null);
    try {
      if (kind === "portrait") update("portrait", await readPortrait(file));
      else {
        const characterSheet = await readCharacterSheet(file);
        patch({
          characterSheet,
          characterSheetMetadata: { name: file.name, size: file.size, uploadedAt: Date.now() },
        });
      }
    } catch (problem) {
      setError(
        problem instanceof Error ? problem.message : "Couldn't read the file. Try another file.",
      );
    }
    setUploading(null);
  }
  function submit(event: React.FormEvent) {
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
      if (character) store.updateCharacter(character.id, { ...form, name: form.name.trim() });
      else store.addCharacter({ ...form, name: form.name.trim() });
      discardDraft(draftId);
      dirtyRef.current = false;
      toast.success(character ? "Character updated" : "Character created");
      router.push("/generate");
    } catch {
      setError(
        "Couldn't save your character. Browser storage may be full. Your draft is still here; try a smaller attachment or export a backup before freeing space.",
      );
    }
  }
  function deleteCharacter() {
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
  }
  return (
    <div className="character-editor">
      <button type="button" className="text-action back-link" onClick={leave}>
        <ArrowLeft size={16} />
        Back to workspace
      </button>
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
      <form onSubmit={submit}>
        <div className="editor-identity">
          <div className="editor-details">
            <div className="field">
              <label htmlFor="character-name">
                Name <span>Required</span>
              </label>
              <input
                ref={nameInput}
                id="character-name"
                name="name"
                autoComplete="off"
                maxLength={200}
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="What do they call you?"
              />
            </div>
            <div className="editor-basics">
              <div className="field">
                <label htmlFor="character-race">Race / species</label>
                <input
                  id="character-race"
                  value={form.race}
                  onChange={(event) => update("race", event.target.value)}
                  placeholder="Half-elf, tiefling, your own…"
                />
              </div>
              <div className="field">
                <label htmlFor="character-class">Class</label>
                <input
                  id="character-class"
                  value={form.class}
                  onChange={(event) => update("class", event.target.value)}
                  placeholder="Bard, rogue, something stranger…"
                />
              </div>
              <div className="field">
                <label htmlFor="character-level">Level</label>
                <input
                  id="character-level"
                  type="number"
                  required
                  min={1}
                  max={20}
                  value={Number.isNaN(form.level) ? "" : form.level}
                  onChange={(event) => update("level", event.target.valueAsNumber)}
                />
              </div>
            </div>
          </div>
          <div className="portrait-field field">
            <label htmlFor="portrait-file">
              Portrait <span>Optional</span>
            </label>
            <div className={`portrait-controls${form.portrait ? " has-portrait" : ""}`}>
              {form.portrait && (
                <Image
                  className="portrait-preview"
                  src={form.portrait}
                  alt={form.name ? `Portrait of ${form.name}` : "Character portrait"}
                  width={80}
                  height={80}
                  unoptimized
                />
              )}
              <div className="portrait-actions">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!!uploading}
                  onClick={() => portraitInput.current?.click()}
                >
                  <Upload size={16} />
                  {uploading === "portrait"
                    ? "Preparing portrait…"
                    : form.portrait
                      ? "Replace portrait"
                      : "Upload portrait"}
                </Button>
                {form.portrait && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="portrait-remove"
                    aria-label="Remove portrait"
                    disabled={!!uploading}
                    onClick={() => update("portrait", undefined)}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Remove
                  </Button>
                )}
              </div>
              <input
                id="portrait-file"
                ref={portraitInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label="Portrait image"
                onChange={(event) => {
                  void upload(event.target.files?.[0], "portrait");
                  event.target.value = "";
                }}
              />
            </div>
            <p className="field-help">JPG, PNG, WebP · up to 5 MB</p>
          </div>
        </div>
        <div className="editor-descriptions">
          <div className="field">
            <label htmlFor="character-backstory">Backstory & personality</label>
            <textarea
              id="character-backstory"
              value={form.backstory}
              onChange={(event) => update("backstory", event.target.value)}
              placeholder="What shaped them? What do they want? How do they speak when they're afraid, angry, or showing off?"
            />
          </div>
          <div className="editor-side">
            <div className="field">
              <label htmlFor="character-appearance">Appearance</label>
              <textarea
                id="character-appearance"
                rows={3}
                value={form.appearance}
                onChange={(event) => update("appearance", event.target.value)}
                placeholder="A battered coat, a missing horn, an impossibly fine hat…"
              />
            </div>
            <div className="field">
              <label htmlFor="character-setting">Campaign setting</label>
              <textarea
                id="character-setting"
                rows={3}
                value={form.worldSetting}
                onChange={(event) => update("worldSetting", event.target.value)}
                placeholder="Their world, companions, factions, and the tone of your campaign."
              />
            </div>
          </div>
        </div>
        <p className="field-help backstory-help">
          A few specific details go further than a complete biography. Habits, beliefs, grudges, and
          favorite expressions all help.
        </p>
        <div className="sheet-row" aria-busy={uploading === "characterSheet"}>
          <div>
            <label htmlFor="character-sheet">Character sheet</label>
            <p className="field-help">
              Optional PDF, up to 5 MB. Used as extra context when generating.
            </p>
          </div>
          <div className="sheet-controls">
            {uploading === "characterSheet" ? (
              <div className="attachment-status" role="status">
                <LoaderCircle className="loading-icon" size={18} />
                <span>Reading PDF…</span>
              </div>
            ) : form.characterSheet ? (
              <div className="attachment-status">
                <FileText size={18} aria-hidden="true" />
                <div>
                  <p className="attachment-name">
                    {form.characterSheetMetadata?.name ?? "Character sheet.pdf"}
                  </p>
                  {form.characterSheetMetadata ? (
                    <p className="field-help">
                      {formatAttachmentSize(form.characterSheetMetadata.size)} · Added{" "}
                      <time
                        dateTime={new Date(form.characterSheetMetadata.uploadedAt).toISOString()}
                      >
                        {formatAttachmentDate(form.characterSheetMetadata.uploadedAt)}
                      </time>
                    </p>
                  ) : (
                    <p
                      className="field-help"
                      title="This older attachment was saved without its original filename or upload date."
                    >
                      {sheetSize !== undefined ? `${formatAttachmentSize(sheetSize)} · ` : ""}PDF
                      attached
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="icon-action"
                  aria-label="Remove PDF"
                  title="Remove PDF"
                  disabled={!!uploading}
                  onClick={() =>
                    patch({ characterSheet: undefined, characterSheetMetadata: undefined })
                  }
                >
                  <Trash2 size={17} />
                </Button>
              </div>
            ) : null}
            {form.characterSheet && (
              <PdfViewer
                sheet={form.characterSheet}
                fileName={form.characterSheetMetadata?.name}
                trigger={
                  <Button type="button" variant="outline" disabled={!!uploading}>
                    <FileText size={16} aria-hidden="true" />
                    View PDF
                  </Button>
                }
              />
            )}
            <Button
              type="button"
              variant="outline"
              disabled={!!uploading}
              onClick={() => sheetInput.current?.click()}
            >
              <Upload size={16} />
              {form.characterSheet ? "Replace PDF" : "Attach PDF"}
            </Button>
            <input
              ref={sheetInput}
              id="character-sheet"
              type="file"
              className="sr-only"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                void upload(event.target.files?.[0], "characterSheet");
                event.target.value = "";
              }}
            />
          </div>
        </div>
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
        <footer className="editor-footer">
          {dirty && unloadBlocked && (
            <div className="refresh-warning" role="alert">
              <p>You have unsaved changes. Save them, or discard them to refresh this page.</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPendingLeave({ kind: "reload" })}
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
}
export function CharacterEditor({ characterId }: { characterId?: string }) {
  const { initialized, characters } = useCharacterStore();
  if (!initialized)
    return (
      <p className="loading-state" role="status">
        Opening character…
      </p>
    );
  const character = characters.find((item) => item.id === characterId);
  if (characterId && !character)
    return (
      <section className="onboarding">
        <h1>Character not found</h1>
        <p>This character may have been removed or belongs to another browser.</p>
        <Link href="/generate" className="primary-link">
          Back to workspace
        </Link>
      </section>
    );
  return <EditorForm key={characterId ?? "new"} character={character} />;
}
