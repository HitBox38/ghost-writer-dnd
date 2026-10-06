"use client";

import * as React from "react";
export const useComboboxAnchor = () => {
  return React.useRef<HTMLDivElement | null>(null);
};
