"use client";

import type { FavoriteText } from "@/lib/types";
export const pickRandomLine = (lines: FavoriteText[]) => {
  return lines[Math.floor(Math.random() * lines.length)];
};
