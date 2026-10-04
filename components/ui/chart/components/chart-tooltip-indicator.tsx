import type { CSSProperties } from "react";
import { cn } from "cn";
import type { ChartConfig, ChartTooltipProps } from "../types";

export const ChartTooltipIndicator = ({
  icon: Icon,
  color,
  indicator,
  hideIndicator,
  nestLabel,
}: Pick<ChartTooltipProps, "indicator" | "hideIndicator"> & {
  icon?: ChartConfig[string]["icon"];
  color?: string;
  nestLabel: boolean;
}) => {
  if (Icon) return <Icon />;
  if (hideIndicator) return null;
  return (
    <div
      className={cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
        "h-2.5 w-2.5": indicator === "dot",
        "w-1": indicator === "line",
        "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
        "my-0.5": nestLabel && indicator === "dashed",
      })}
      style={{ "--color-bg": color, "--color-border": color } as CSSProperties}
    />
  );
};
