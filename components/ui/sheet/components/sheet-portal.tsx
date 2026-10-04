"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
export const SheetPortal = ({ ...props }: SheetPrimitive.Portal.Props) => {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
};
