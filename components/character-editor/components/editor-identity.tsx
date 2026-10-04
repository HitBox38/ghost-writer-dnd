"use client";

import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
import { PortraitField } from "@/components/character-editor/components/portrait-field";
export const EditorIdentity = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const { nameInput, form, update } = state;
  return (
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
      <PortraitField state={state} />
    </div>
  );
};
