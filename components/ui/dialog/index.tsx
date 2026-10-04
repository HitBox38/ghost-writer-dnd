"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
export const Dialog = ({ ...props }: DialogPrimitive.Root.Props) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};
export { DialogClose } from "@/components/ui/dialog/components/dialog-close";
export { DialogContent } from "@/components/ui/dialog/components/dialog-content";
export { DialogDescription } from "@/components/ui/dialog/components/dialog-description";
export { DialogFooter } from "@/components/ui/dialog/components/dialog-footer";
export { DialogHeader } from "@/components/ui/dialog/components/dialog-header";
export { DialogOverlay } from "@/components/ui/dialog/components/dialog-overlay";
export { DialogPortal } from "@/components/ui/dialog/components/dialog-portal";
export { DialogTitle } from "@/components/ui/dialog/components/dialog-title";
export { DialogTrigger } from "@/components/ui/dialog/components/dialog-trigger";
