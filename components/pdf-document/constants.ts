"use client";

import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Assets are copied from the installed PDF.js version by the dev/build scripts.
export const assetPath = `/pdfjs/${pdfjs.version}/`;
pdfjs.GlobalWorkerOptions.workerSrc = `${assetPath}pdf.worker.min.mjs`;
export const options = {
  cMapUrl: `${assetPath}cmaps/`,
  standardFontDataUrl: `${assetPath}standard_fonts/`,
  wasmUrl: `${assetPath}wasm/`,
};
