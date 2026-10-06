"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
export const AlertDialogPortal = ({ ...props }: AlertDialogPrimitive.Portal.Props) => {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
};
