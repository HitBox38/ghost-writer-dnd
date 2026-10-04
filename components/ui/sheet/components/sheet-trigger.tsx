"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
export const SheetTrigger = ({ ...props }: SheetPrimitive.Trigger.Props) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
};
