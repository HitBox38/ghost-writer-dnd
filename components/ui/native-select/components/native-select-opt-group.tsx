import * as React from "react";
import { cn } from "cn";
export const NativeSelectOptGroup = ({ className, ...props }: React.ComponentProps<"optgroup">) => {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  );
};
