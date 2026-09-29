"use client";

import { useEffect, useState, type ReactElement } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { characterSheetBlob } from "@/lib/pdf";
import { PdfLoading } from "@/components/pdf-loading";

const PdfDocument = dynamic(() => import("@/components/pdf-document"), {
  ssr: false,
  loading: () => <PdfLoading />,
});

function PdfPreview({ sheet, fileName }: { sheet: string; fileName: string }) {
  const [source, setSource] = useState<{ sheet: string; url?: string; error?: string }>();

  useEffect(() => {
    let url: string | undefined;
    let error: string | undefined;
    try {
      url = URL.createObjectURL(characterSheetBlob(sheet));
    } catch {
      error = "This PDF couldn't be read. Try replacing the attachment.";
    }
    // The URL is a browser resource allocated and released by this effect, not derived render state.
    // oxlint-disable-next-line react/set-state-in-effect
    setSource({ sheet, url, error });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [sheet]);

  if (source?.sheet !== sheet) return <PdfLoading />;
  if (!source.url)
    return (
      <p className="pdf-viewer-message" role="alert">
        {source.error}
      </p>
    );

  return (
    <>
      <a className="pdf-download" href={source.url} download={fileName}>
        <Download size={15} aria-hidden="true" />
        Download PDF
      </a>
      <PdfDocument key={source.url} url={source.url} />
    </>
  );
}

export function PdfViewer({
  sheet,
  fileName = "Character sheet.pdf",
  trigger,
}: {
  sheet: string;
  fileName?: string;
  trigger: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="pdf-viewer-modal" onKeyDown={(event) => event.stopPropagation()}>
        <DialogHeader className="pdf-viewer-header">
          <DialogTitle className="pdf-viewer-title">{fileName}</DialogTitle>
          <DialogDescription>Character sheet · PDF preview</DialogDescription>
        </DialogHeader>
        {open && <PdfPreview sheet={sheet} fileName={fileName} />}
      </DialogContent>
    </Dialog>
  );
}
