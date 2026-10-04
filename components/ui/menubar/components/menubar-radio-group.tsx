"use client";

import * as React from "react";
import { DropdownMenuRadioGroup } from "@/components/ui/dropdown-menu";
export const MenubarRadioGroup = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) => {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />;
};
