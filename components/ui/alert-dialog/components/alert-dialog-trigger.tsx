"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
export const AlertDialogTrigger = ({ ...props }: AlertDialogPrimitive.Trigger.Props) => {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
};
