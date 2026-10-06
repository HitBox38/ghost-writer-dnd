"use client";

import * as React from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
export const MenubarMenu = ({ ...props }: React.ComponentProps<typeof DropdownMenu>) => {
  return <DropdownMenu data-slot="menubar-menu" {...props} />;
};
