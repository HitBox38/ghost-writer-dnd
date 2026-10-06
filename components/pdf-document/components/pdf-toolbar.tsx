"use client";

import { usePdfDocument } from "@/components/pdf-document/hooks/use-pdf-document";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

export const PdfToolbar = ({ state }: { state: ReturnType<typeof usePdfDocument> }) => {
  const { page, pages, changePage, failed, zoom, setZoom, viewport, actions } = state;
  return (
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
      <div className="pdf-toolbar-actions">
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
              viewport.current?.scrollTo({
                top: 0,
                left: 0,
              });
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
        {actions}
      </div>
    </div>
  );
};
