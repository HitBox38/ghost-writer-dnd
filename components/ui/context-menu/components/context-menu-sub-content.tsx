"use client";

import * as React from "react";
import { ContextMenuContent } from "@/components/ui/context-menu/components/context-menu-content";
export const ContextMenuSubContent = ({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) => {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className="shadow-lg"
      side="right"
      {...props}
    />
  );
};
