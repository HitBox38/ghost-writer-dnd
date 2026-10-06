"use client";

import type { SidebarProps } from "../types";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar } from "../hooks/use-sidebar";
import { SIDEBAR_WIDTH_MOBILE } from "../constants";
export const MobileSidebar = ({
  side = "left",
  variant: _variant = "sidebar",
  collapsible: _collapsible = "offcanvas",
  className: _className,
  children,
  dir,
  mobileTitle = "Sidebar",
  mobileDescription = "Displays the mobile sidebar.",
  mobileContentProps,
  ...props
}: SidebarProps) => {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
      <SheetContent
        dir={dir}
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
          } as React.CSSProperties
        }
        side={side}
        {...mobileContentProps}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{mobileTitle}</SheetTitle>
          <SheetDescription>{mobileDescription}</SheetDescription>
        </SheetHeader>
        <div className="flex h-full w-full flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  );
};
