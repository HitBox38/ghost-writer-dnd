"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "cn";
export const ContextMenuLabel = ({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) => {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8",
        className,
      )}
      {...props}
    />
  );
};
