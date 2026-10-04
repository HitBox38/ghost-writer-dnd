"use client";

import type { ChartTooltipProps } from "../types";
import { ActiveChartTooltipContent } from "./active-chart-tooltip-content";

export const ChartTooltipContent = ({ active, payload, ...props }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return <ActiveChartTooltipContent payload={payload} {...props} />;
};
