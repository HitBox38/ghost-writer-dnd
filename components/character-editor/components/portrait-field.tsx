"use client";

import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export const PortraitField = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const { form, uploading, portraitInput, update, upload } = state;
  return (
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
  );
};
