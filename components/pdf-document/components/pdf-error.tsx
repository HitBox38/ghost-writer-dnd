"use client";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

export const PdfError = () => {
  return (
    <p className="pdf-viewer-message" role="alert">
      This PDF couldn&apos;t be previewed. It may be damaged or password protected. You can download
      it to open in another PDF reader.
    </p>
  );
};
