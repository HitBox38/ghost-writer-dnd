"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
export const ToastPortal = ({ ...props }: ToastPrimitive.Portal.Props) => {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
};
