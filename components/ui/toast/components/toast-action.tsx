"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
export const ToastAction = ({ className, render, ...props }: ToastPrimitive.Action.Props) => {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render === undefined ? <Button variant="outline" size="sm" /> : render}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
};
