import { THEMES } from "@/components/ui/chart/constants";
import * as React from "react";
export type TooltipNameType = number | string;
export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | {
        color?: string;
        theme?: never;
      }
    | {
        color?: never;
        theme: Record<keyof typeof THEMES, string>;
      }
  )
>;
export type ChartContextProps = {
  config: ChartConfig;
};
import type { TooltipValueType } from "recharts";

import * as RechartsPrimitive from "recharts";
export type ChartTooltipProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>,
    "accessibilityLayer"
  >;

export type ActiveChartTooltipProps = Omit<ChartTooltipProps, "active" | "payload"> & {
  payload: NonNullable<ChartTooltipProps["payload"]>;
};
