"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "cn";
export const ToastDescription = ({ className, ...props }: ToastPrimitive.Description.Props) => {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};
