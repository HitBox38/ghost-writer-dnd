"use client";

import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { cn } from "cn";
export const Menubar = ({ className, ...props }: MenubarPrimitive.Props) => {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn("flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs", className)}
      {...props}
    />
  );
};
export { MenubarPortal } from "@/components/ui/menubar/components/menubar-portal";
export { MenubarMenu } from "@/components/ui/menubar/components/menubar-menu";
export { MenubarTrigger } from "@/components/ui/menubar/components/menubar-trigger";
export { MenubarContent } from "@/components/ui/menubar/components/menubar-content";
export { MenubarGroup } from "@/components/ui/menubar/components/menubar-group";
export { MenubarSeparator } from "@/components/ui/menubar/components/menubar-separator";
export { MenubarLabel } from "@/components/ui/menubar/components/menubar-label";
export { MenubarItem } from "@/components/ui/menubar/components/menubar-item";
export { MenubarShortcut } from "@/components/ui/menubar/components/menubar-shortcut";
export { MenubarCheckboxItem } from "@/components/ui/menubar/components/menubar-checkbox-item";
export { MenubarRadioGroup } from "@/components/ui/menubar/components/menubar-radio-group";
export { MenubarRadioItem } from "@/components/ui/menubar/components/menubar-radio-item";
export { MenubarSub } from "@/components/ui/menubar/components/menubar-sub";
export { MenubarSubTrigger } from "@/components/ui/menubar/components/menubar-sub-trigger";
export { MenubarSubContent } from "@/components/ui/menubar/components/menubar-sub-content";
