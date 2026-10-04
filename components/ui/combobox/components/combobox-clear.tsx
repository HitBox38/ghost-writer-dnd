"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "cn";
import { InputGroupButton } from "@/components/ui/input-group";
import { XIcon } from "lucide-react";
export const ComboboxClear = ({ className, ...props }: ComboboxPrimitive.Clear.Props) => {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
};
