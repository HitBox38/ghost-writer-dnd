"use client";

import * as React from "react";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";
export const MenubarGroup = ({ ...props }: React.ComponentProps<typeof DropdownMenuGroup>) => {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />;
};
