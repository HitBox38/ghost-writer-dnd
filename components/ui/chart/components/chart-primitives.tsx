"use client";

import dynamic from "next/dynamic";

export const ChartTooltip = dynamic(() => import("recharts").then((module) => module.Tooltip));
export const ChartLegend = dynamic(() => import("recharts").then((module) => module.Legend));
export const ResponsiveContainer = dynamic(() =>
  import("recharts").then((module) => module.ResponsiveContainer),
);
