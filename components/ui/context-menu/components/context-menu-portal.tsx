"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
export const ContextMenuPortal = ({ ...props }: ContextMenuPrimitive.Portal.Props) => {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
};
