"use client";

import { type ReactElement } from "react";
import { useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PdfPreview } from "@/components/pdf-viewer/components/pdf-preview";
export const PdfViewer = ({
  sheet,
  fileName = "Character sheet.pdf",
  trigger,
}: {
  sheet: string;
  fileName?: string;
  trigger: ReactElement;
}) => {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen && fullscreen && details.reason === "escape-key") {
          details.cancel();
          setFullscreen(false);
          return;
        }
        setOpen(nextOpen);
        if (!nextOpen) setFullscreen(false);
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent
        className="pdf-viewer-modal"
        data-fullscreen={fullscreen || undefined}
        style={
          fullscreen
            ? {
                translate: "none",
              }
            : undefined
        }
        onKeyDown={(event) => event.stopPropagation()}
      >
        <DialogHeader className="pdf-viewer-header">
          <DialogTitle className="pdf-viewer-title">{fileName}</DialogTitle>
          <DialogDescription>Character sheet · PDF preview</DialogDescription>
        </DialogHeader>
        {open && (
          <PdfPreview
            sheet={sheet}
            fileName={fileName}
            fullscreenControl={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={fullscreen ? "Exit full screen" : "Full screen"}
                title={fullscreen ? "Exit full screen" : "Full screen"}
                aria-pressed={fullscreen}
                onClick={() => setFullscreen((value) => !value)}
              >
                {fullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
              </Button>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
