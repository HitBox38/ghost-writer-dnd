"use client";

import * as React from "react";
import { cn } from "cn";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";
export const MenubarLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel> & {
  inset?: boolean;
}) => {
  return (
    <DropdownMenuLabel
      data-slot="menubar-label"
      data-inset={inset}
      className={cn("px-2 py-1.5 text-sm font-medium data-inset:pl-8", className)}
      {...props}
    />
  );
};
