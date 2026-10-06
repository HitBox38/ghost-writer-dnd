import * as React from "react";
import { cn } from "cn";
export const ItemFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="item-footer"
      className={cn("flex basis-full items-center justify-between gap-2", className)}
      {...props}
    />
  );
};
