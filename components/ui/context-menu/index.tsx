"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
export const ContextMenu = ({ ...props }: ContextMenuPrimitive.Root.Props) => {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
};
export { ContextMenuTrigger } from "@/components/ui/context-menu/components/context-menu-trigger";
export { ContextMenuContent } from "@/components/ui/context-menu/components/context-menu-content";
export { ContextMenuItem } from "@/components/ui/context-menu/components/context-menu-item";
export { ContextMenuCheckboxItem } from "@/components/ui/context-menu/components/context-menu-checkbox-item";
export { ContextMenuRadioItem } from "@/components/ui/context-menu/components/context-menu-radio-item";
export { ContextMenuLabel } from "@/components/ui/context-menu/components/context-menu-label";
export { ContextMenuSeparator } from "@/components/ui/context-menu/components/context-menu-separator";
export { ContextMenuShortcut } from "@/components/ui/context-menu/components/context-menu-shortcut";
export { ContextMenuGroup } from "@/components/ui/context-menu/components/context-menu-group";
export { ContextMenuPortal } from "@/components/ui/context-menu/components/context-menu-portal";
export { ContextMenuSub } from "@/components/ui/context-menu/components/context-menu-sub";
export { ContextMenuSubContent } from "@/components/ui/context-menu/components/context-menu-sub-content";
export { ContextMenuSubTrigger } from "@/components/ui/context-menu/components/context-menu-sub-trigger";
export { ContextMenuRadioGroup } from "@/components/ui/context-menu/components/context-menu-radio-group";
