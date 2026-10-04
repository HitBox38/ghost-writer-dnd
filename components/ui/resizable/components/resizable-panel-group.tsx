"use client";

import { cn } from "cn";
import * as ResizablePrimitive from "react-resizable-panels";
export const ResizablePanelGroup = ({ className, ...props }: ResizablePrimitive.GroupProps) => {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)}
      {...props}
    />
  );
};
