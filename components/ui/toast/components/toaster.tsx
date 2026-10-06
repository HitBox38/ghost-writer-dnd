"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { toast } from "../constants";
import { ToastProvider } from "./toast-provider";
import { ToastPortal } from "./toast-portal";
import { ToastViewport } from "./toast-viewport";
import { ToastList } from "./toast-list";
export const Toaster = ({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) => {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
};
