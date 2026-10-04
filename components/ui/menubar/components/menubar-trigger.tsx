"use client";

import * as React from "react";
import { cn } from "cn";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const MenubarTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) => {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted",
        className,
      )}
      {...props}
    />
  );
};
