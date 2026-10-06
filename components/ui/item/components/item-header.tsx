import * as React from "react";
import { cn } from "cn";
export const ItemHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="item-header"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  );
};
