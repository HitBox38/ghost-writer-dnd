import { LoaderCircle } from "lucide-react";

export function PdfLoading() {
  return (
    <p className="pdf-viewer-message" role="status">
      <LoaderCircle className="loading-icon" size={20} aria-hidden="true" />
      Opening PDF…
    </p>
  );
}
