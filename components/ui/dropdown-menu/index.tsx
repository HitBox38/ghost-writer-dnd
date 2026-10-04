"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
export const DropdownMenu = ({ ...props }: MenuPrimitive.Root.Props) => {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
};
export { DropdownMenuPortal } from "@/components/ui/dropdown-menu/components/dropdown-menu-portal";
export { DropdownMenuTrigger } from "@/components/ui/dropdown-menu/components/dropdown-menu-trigger";
export { DropdownMenuContent } from "@/components/ui/dropdown-menu/components/dropdown-menu-content";
export { DropdownMenuGroup } from "@/components/ui/dropdown-menu/components/dropdown-menu-group";
export { DropdownMenuLabel } from "@/components/ui/dropdown-menu/components/dropdown-menu-label";
export { DropdownMenuItem } from "@/components/ui/dropdown-menu/components/dropdown-menu-item";
export { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu/components/dropdown-menu-checkbox-item";
export { DropdownMenuRadioGroup } from "@/components/ui/dropdown-menu/components/dropdown-menu-radio-group";
export { DropdownMenuRadioItem } from "@/components/ui/dropdown-menu/components/dropdown-menu-radio-item";
export { DropdownMenuSeparator } from "@/components/ui/dropdown-menu/components/dropdown-menu-separator";
export { DropdownMenuShortcut } from "@/components/ui/dropdown-menu/components/dropdown-menu-shortcut";
export { DropdownMenuSub } from "@/components/ui/dropdown-menu/components/dropdown-menu-sub";
export { DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu/components/dropdown-menu-sub-trigger";
export { DropdownMenuSubContent } from "@/components/ui/dropdown-menu/components/dropdown-menu-sub-content";
