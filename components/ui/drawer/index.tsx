"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { DrawerContext } from "@/components/ui/drawer/constants";
export const Drawer = ({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  ...props
}: DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean;
}) => {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0;
  const contextValue = React.useMemo(
    () => ({
      hasSnapPoints,
      modal,
      showSwipeHandle,
      swipeDirection,
    }),
    [hasSnapPoints, modal, showSwipeHandle, swipeDirection],
  );
  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
};
export { DrawerPortal } from "@/components/ui/drawer/components/drawer-portal";
export { DrawerOverlay } from "@/components/ui/drawer/components/drawer-overlay";
export { DrawerSwipeHandle } from "@/components/ui/drawer/components/drawer-swipe-handle";
export { DrawerTrigger } from "@/components/ui/drawer/components/drawer-trigger";
export { DrawerClose } from "@/components/ui/drawer/components/drawer-close";
export { DrawerContent } from "@/components/ui/drawer/components/drawer-content";
export { DrawerHeader } from "@/components/ui/drawer/components/drawer-header";
export { DrawerFooter } from "@/components/ui/drawer/components/drawer-footer";
export { DrawerTitle } from "@/components/ui/drawer/components/drawer-title";
export { DrawerDescription } from "@/components/ui/drawer/components/drawer-description";
