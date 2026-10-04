"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
export const AlertDialog = ({ ...props }: AlertDialogPrimitive.Root.Props) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
};
export { AlertDialogAction } from "@/components/ui/alert-dialog/components/alert-dialog-action";
export { AlertDialogCancel } from "@/components/ui/alert-dialog/components/alert-dialog-cancel";
export { AlertDialogContent } from "@/components/ui/alert-dialog/components/alert-dialog-content";
export { AlertDialogDescription } from "@/components/ui/alert-dialog/components/alert-dialog-description";
export { AlertDialogFooter } from "@/components/ui/alert-dialog/components/alert-dialog-footer";
export { AlertDialogHeader } from "@/components/ui/alert-dialog/components/alert-dialog-header";
export { AlertDialogMedia } from "@/components/ui/alert-dialog/components/alert-dialog-media";
export { AlertDialogOverlay } from "@/components/ui/alert-dialog/components/alert-dialog-overlay";
export { AlertDialogPortal } from "@/components/ui/alert-dialog/components/alert-dialog-portal";
export { AlertDialogTitle } from "@/components/ui/alert-dialog/components/alert-dialog-title";
export { AlertDialogTrigger } from "@/components/ui/alert-dialog/components/alert-dialog-trigger";
