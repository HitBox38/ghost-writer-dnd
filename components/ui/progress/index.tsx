"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "cn";
import { ProgressTrack } from "./components/progress-track";
import { ProgressIndicator } from "./components/progress-indicator";
export const Progress = ({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) => {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
};
export { ProgressTrack } from "./components/progress-track";
export { ProgressIndicator } from "./components/progress-indicator";
export { ProgressLabel } from "./components/progress-label";
export { ProgressValue } from "./components/progress-value";
