"use client";

import type { SidebarProps } from "../types";
import { cn } from "cn";
export const StaticSidebar = ({
  side: _side = "left",
  variant: _variant = "sidebar",
  collapsible: _collapsible = "offcanvas",
  className,
  children,
  dir: _dir,
  mobileTitle: _mobileTitle = "Sidebar",
  mobileDescription: _mobileDescription = "Displays the mobile sidebar.",
  mobileContentProps: _mobileContentProps,
  ...props
}: SidebarProps) => {
  return (
    <div
      data-slot="sidebar"
      className={cn(
        "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
