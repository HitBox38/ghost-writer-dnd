"use client";

import * as React from "react";
import { ChartContextProps } from "@/components/ui/chart/types";
export const THEMES = {
  light: "",
  dark: ".dark",
} as const;
export const INITIAL_DIMENSION = {
  width: 320,
  height: 200,
} as const;
export const ChartContext = React.createContext<ChartContextProps | null>(null);
