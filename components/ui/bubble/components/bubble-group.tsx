import * as React from "react";
import { cn } from "cn";
export const BubbleGroup = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  );
};
