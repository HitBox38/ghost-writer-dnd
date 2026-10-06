"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
export const SheetClose = ({ ...props }: SheetPrimitive.Close.Props) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
};
