"use client";

import * as React from "react";
import { cn } from "cn";

import { useChart } from "@/components/ui/chart/hooks/use-chart";
import { getPayloadConfigFromPayload } from "@/components/ui/chart/helpers";
import type { ChartTooltipProps } from "../types";
import { ChartTooltipIndicator } from "./chart-tooltip-indicator";
export const ChartTooltipItem = ({
  item,
  index,
  nameKey,
  color,
  indicator,
  hideIndicator,
  formatter,
  nestLabel,
  tooltipLabel,
}: Pick<ChartTooltipProps, "nameKey" | "color" | "indicator" | "hideIndicator" | "formatter"> & {
  item: NonNullable<ChartTooltipProps["payload"]>[number];
  index: number;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
}) => {
  const { config } = useChart();
  const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const indicatorColor = color ?? item.payload?.fill ?? item.color;
  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
        indicator === "dot" && "items-center",
      )}
    >
      {formatter && item?.value !== undefined && item.name ? (
        formatter(item.value, item.name, item, index, item.payload)
      ) : (
        <>
          <ChartTooltipIndicator
            icon={itemConfig?.icon}
            color={indicatorColor}
            indicator={indicator}
            hideIndicator={hideIndicator}
            nestLabel={nestLabel}
          />
          <div
            className={cn(
              "flex flex-1 justify-between leading-none",
              nestLabel ? "items-end" : "items-center",
            )}
          >
            <div className="grid gap-1.5">
              {nestLabel ? tooltipLabel : null}
              <span className="text-muted-foreground">{itemConfig?.label ?? item.name}</span>
            </div>
            {item.value != null && (
              <span className="font-mono font-medium text-foreground tabular-nums">
                {typeof item.value === "number" ? item.value.toLocaleString() : String(item.value)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
