"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
export const ContextMenuGroup = ({ ...props }: ContextMenuPrimitive.Group.Props) => {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
};
