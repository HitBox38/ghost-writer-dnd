"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
export const ToastClose = ({
  className,
  children,
  render,
  ...props
}: ToastPrimitive.Close.Props) => {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={
        render === undefined ? (
          <Button variant="ghost" size="icon-sm" aria-label="Close toast" />
        ) : (
          render
        )
      }
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
};
