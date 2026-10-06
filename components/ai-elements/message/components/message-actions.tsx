"use client";

import type { MessageActionsProps } from "@/components/ai-elements/message/types";
import { cn } from "@/lib/utils";
export const MessageActions = ({ className, children, ...props }: MessageActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);
