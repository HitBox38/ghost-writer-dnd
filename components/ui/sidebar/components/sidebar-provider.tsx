"use client";

import { useSidebarProvider } from "@/components/ui/sidebar/hooks/use-sidebar-provider";
import * as React from "react";
import { cn } from "cn";
import { SidebarContext, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "../constants";
export const SidebarProvider = (inputProps: Parameters<typeof useSidebarProvider>[0]) => {
  const { contextValue, style, className, props, children } = useSidebarProvider(inputProps);
  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};
