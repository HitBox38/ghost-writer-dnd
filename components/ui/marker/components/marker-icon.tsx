import * as React from "react";
import { cn } from "cn";
export const MarkerIcon = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn("size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    />
  );
};
