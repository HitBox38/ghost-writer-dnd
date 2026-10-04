"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "cn";
export const ContextMenuTrigger = ({ className, ...props }: ContextMenuPrimitive.Trigger.Props) => {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn("select-none", className)}
      {...props}
    />
  );
};
