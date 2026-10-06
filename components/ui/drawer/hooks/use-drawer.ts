"use client";

import * as React from "react";
import { DrawerContext } from "@/components/ui/drawer/constants";
export const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.");
  }
  return context;
};
