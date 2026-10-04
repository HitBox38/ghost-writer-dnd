"use client";

import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
export const EditorDescriptions = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const { form, update } = state;
  return (
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
  );
};
