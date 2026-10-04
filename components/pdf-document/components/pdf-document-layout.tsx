"use client";

import { PdfToolbar } from "@/components/pdf-document/components/pdf-toolbar";
import { usePdfDocument } from "@/components/pdf-document/hooks/use-pdf-document";
import { Document, Page } from "react-pdf";
import { PdfLoading } from "@/components/pdf-loading";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { options } from "@/components/pdf-document/constants";
import { PdfError } from "@/components/pdf-document/components/pdf-error";
export const PdfDocumentLayout = ({ state }: { state: ReturnType<typeof usePdfDocument> }) => {
  const { page, changePage, zoom, viewport, url, setPages, setFailed, width, devicePixelRatio } =
    state;
  return (
    <div className="pdf-document">
      <PdfToolbar state={state} />
      <div className="pdf-viewport" ref={viewport} tabIndex={0} role="region" aria-label="PDF page">
        <Document
          file={url}
          options={options}
          suspense={false}
          loading={<PdfLoading />}
          error={<PdfError />}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
          onLoadError={() => setFailed(true)}
          onSourceError={() => setFailed(true)}
          onPassword={(callback) => callback(null)}
          onItemClick={({ pageNumber }) => {
            if (pageNumber) changePage(pageNumber);
          }}
          externalLinkTarget="_blank"
        >
          {width > 0 && (
            <Page
              pageNumber={page}
              width={Math.min(width, 1000)}
              scale={zoom}
              loading={<PdfLoading />}
              error={<PdfError />}
              devicePixelRatio={devicePixelRatio}
            />
          )}
        </Document>
      </div>
    </div>
  );
};
