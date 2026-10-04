"use client";

import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { usePdfSource } from "../hooks/use-pdf-source";
import { PdfLoading } from "@/components/pdf-loading";
import { PdfDocument } from "@/components/pdf-viewer/components/lazy-pdf-document";
export const PdfPreview = ({
  sheet,
  fileName,
  fullscreenControl,
}: {
  sheet: string;
  fileName: string;
  fullscreenControl: ReactNode;
}) => {
  const source = usePdfSource(sheet);
  if (!source) return <PdfLoading />;
  if (!source.url)
    return (
      <p className="pdf-viewer-message" role="alert">
        {source.error}
      </p>
    );
  return (
    <PdfDocument
      key={source.url}
      url={source.url}
      actions={
        <>
          <a
            className="pdf-download"
            href={source.url}
            download={fileName}
            aria-label="Download PDF"
            title="Download PDF"
          >
            <Download size={16} aria-hidden="true" />
            <span>Download PDF</span>
          </a>
          {fullscreenControl}
        </>
      }
    />
  );
};
