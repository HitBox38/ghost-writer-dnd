"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "cn";
export const ProgressValue = ({ className, ...props }: ProgressPrimitive.Value.Props) => {
  return (
    <ProgressPrimitive.Value
      className={cn("ml-auto text-sm text-muted-foreground tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  );
};
