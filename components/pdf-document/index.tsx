"use client";

import { PdfDocumentLayout } from "@/components/pdf-document/components/pdf-document-layout";
import { usePdfDocument } from "@/components/pdf-document/hooks/use-pdf-document";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

export const PdfDocument = (props: Parameters<typeof usePdfDocument>[0]) => {
  const state = usePdfDocument(props);
  return <PdfDocumentLayout state={state} />;
};
export default PdfDocument;
