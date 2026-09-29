"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfLoading } from "@/components/pdf-loading";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Assets are copied from the installed PDF.js version by the dev/build scripts.
const assetPath = `/pdfjs/${pdfjs.version}/`;
pdfjs.GlobalWorkerOptions.workerSrc = `${assetPath}pdf.worker.min.mjs`;
const options = {
  cMapUrl: `${assetPath}cmaps/`,
  standardFontDataUrl: `${assetPath}standard_fonts/`,
  wasmUrl: `${assetPath}wasm/`,
};

function PdfError() {
  return (
    <p className="pdf-viewer-message" role="alert">
      This PDF couldn&apos;t be previewed. It may be damaged or password protected. You can download
      it to open in another PDF reader.
    </p>
  );
}

export default function PdfDocument({ url }: { url: string }) {
  const [pages, setPages] = useState(0);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const resize = () => setWidth(Math.max(1, element.clientWidth - 32));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function changePage(next: number) {
    setPage(Math.max(1, Math.min(pages, next)));
    viewport.current?.scrollTo({ top: 0, left: 0 });
  }

  return (
    <div className="pdf-document">
      <div className="pdf-toolbar" aria-label="PDF controls">
        <div className="pdf-control-group">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page <= 1 || !pages}
            onClick={() => changePage(page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <span className="pdf-page-count" role="status" aria-live="polite">
            {pages ? `Page ${page} of ${pages}` : failed ? "Unavailable" : "Loading pages…"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= pages || !pages}
            onClick={() => changePage(page + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
        <div className="pdf-control-group">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Zoom out"
            disabled={zoom <= 0.5 || !pages}
            onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))}
          >
            <Minus aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="pdf-fit"
            disabled={!pages}
            onClick={() => {
              setZoom(1);
              viewport.current?.scrollTo({ top: 0, left: 0 });
            }}
            aria-label="Fit page to width"
            title="Fit page to width"
          >
            {zoom === 1 ? "Fit width" : `${Math.round(zoom * 100)}%`}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Zoom in"
            disabled={zoom >= 3 || !pages}
            onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
          >
            <Plus aria-hidden="true" />
          </Button>
        </div>
      </div>
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
              devicePixelRatio={Math.min(window.devicePixelRatio || 1, 2)}
            />
          )}
        </Document>
      </div>
    </div>
  );
}
