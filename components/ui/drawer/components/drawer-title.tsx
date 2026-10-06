"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cn } from "cn";
export const DrawerTitle = ({ className, ...props }: DrawerPrimitive.Title.Props) => {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
};
