"use client";

import * as React from "react";
import { cn } from "cn";
export const PopoverHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  );
};
