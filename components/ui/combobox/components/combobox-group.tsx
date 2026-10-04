"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "cn";
export const ComboboxGroup = ({ className, ...props }: ComboboxPrimitive.Group.Props) => {
  return (
    <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
  );
};
