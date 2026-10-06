"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "cn";
export const SheetTitle = ({ className, ...props }: SheetPrimitive.Title.Props) => {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
};
