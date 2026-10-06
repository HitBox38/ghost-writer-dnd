"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
export const ToastProvider = ({ ...props }: ToastPrimitive.Provider.Props) => {
  return <ToastPrimitive.Provider {...props} />;
};
