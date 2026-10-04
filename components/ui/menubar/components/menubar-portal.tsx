"use client";

import * as React from "react";
import { DropdownMenuPortal } from "@/components/ui/dropdown-menu";
export const MenubarPortal = ({ ...props }: React.ComponentProps<typeof DropdownMenuPortal>) => {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />;
};
