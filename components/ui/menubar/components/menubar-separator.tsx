"use client";

import * as React from "react";
import { cn } from "cn";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
export const MenubarSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) => {
  return (
    <DropdownMenuSeparator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
};
