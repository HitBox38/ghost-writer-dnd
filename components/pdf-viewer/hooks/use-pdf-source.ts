"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createPdfSource } from "../helpers";

export const usePdfSource = (sheet: string) => {
  const source = useMemo(() => createPdfSource(sheet), [sheet]);
  return useSyncExternalStore(source.subscribe, source.getSnapshot, source.getServerSnapshot);
};
