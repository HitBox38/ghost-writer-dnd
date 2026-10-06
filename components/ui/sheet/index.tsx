"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
export const Sheet = ({ ...props }: SheetPrimitive.Root.Props) => {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
};
export { SheetTrigger } from "./components/sheet-trigger";
export { SheetClose } from "./components/sheet-close";
export { SheetContent } from "./components/sheet-content";
export { SheetHeader } from "./components/sheet-header";
export { SheetFooter } from "./components/sheet-footer";
export { SheetTitle } from "./components/sheet-title";
export { SheetDescription } from "./components/sheet-description";
