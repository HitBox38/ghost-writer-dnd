"use client";

import dynamic from "next/dynamic";
import { PdfLoading } from "@/components/pdf-loading";
export const PdfDocument = dynamic(() => import("@/components/pdf-document"), {
  ssr: false,
  loading: () => <PdfLoading />,
});
