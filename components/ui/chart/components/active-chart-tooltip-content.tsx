"use client";

import { ChartTooltipItem } from "./chart-tooltip-item";
import type { ActiveChartTooltipProps } from "../types";

import * as React from "react";
import { cn } from "cn";

import { useChart } from "@/components/ui/chart/hooks/use-chart";
import { getPayloadConfigFromPayload } from "@/components/ui/chart/helpers";
export const ActiveChartTooltipContent = ({
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ActiveChartTooltipProps) => {
  const { config } = useChart();
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }
    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label;
    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
      );
    }
    if (!value) {
      return null;
    }
    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);
  const nestLabel = payload.length === 1 && indicator !== "dot";
  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => (
            <ChartTooltipItem
              key={`${item.graphicalItemId}:${item.name ?? item.dataKey}`}
              {...{
                item,
                index,
                nameKey,
                color,
                indicator,
                hideIndicator,
                formatter,
                nestLabel,
                tooltipLabel,
              }}
            />
          ))}
      </div>
    </div>
  );
};
