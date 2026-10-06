"use client";

import * as React from "react";
import { DropdownMenuSub } from "@/components/ui/dropdown-menu";
export const MenubarSub = ({ ...props }: React.ComponentProps<typeof DropdownMenuSub>) => {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />;
};
