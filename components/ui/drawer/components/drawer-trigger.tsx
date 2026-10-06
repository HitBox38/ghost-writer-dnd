"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
export const DrawerTrigger = ({ ...props }: DrawerPrimitive.Trigger.Props) => {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
};
