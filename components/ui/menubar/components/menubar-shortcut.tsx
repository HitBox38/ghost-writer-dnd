"use client";

import * as React from "react";
import { cn } from "cn";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
export const MenubarShortcut = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) => {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
};
