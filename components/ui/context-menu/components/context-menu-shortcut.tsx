"use client";

import * as React from "react";
import { cn } from "cn";
export const ContextMenuShortcut = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
};
