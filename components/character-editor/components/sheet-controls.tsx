"use client";

import { useEditorForm } from "@/components/character-editor/hooks/use-editor-form";
import { Upload, Trash2, FileText, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/pdf-viewer";
import { formatAttachmentDate, formatAttachmentSize } from "@/lib/attachment-format";
export const SheetControls = ({ state }: { state: ReturnType<typeof useEditorForm> }) => {
  const { uploading, form, sheetSize, patch, sheetInput, upload } = state;
  return (
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
                <time dateTime={new Date(form.characterSheetMetadata.uploadedAt).toISOString()}>
                  {formatAttachmentDate(form.characterSheetMetadata.uploadedAt)}
                </time>
              </p>
            ) : (
              <p
                className="field-help"
                title="This older attachment was saved without its original filename or upload date."
              >
                {sheetSize !== undefined ? `${formatAttachmentSize(sheetSize)} · ` : ""}PDF attached
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
              patch({
                characterSheet: undefined,
                characterSheetMetadata: undefined,
              })
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
        aria-label="Character sheet PDF"
        type="file"
        className="sr-only"
        accept=".pdf,application/pdf"
        onChange={(event) => {
          void upload(event.target.files?.[0], "characterSheet");
          event.target.value = "";
        }}
      />
    </div>
  );
};
