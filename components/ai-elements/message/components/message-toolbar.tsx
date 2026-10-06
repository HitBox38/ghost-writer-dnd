"use client";

import type { MessageToolbarProps } from "@/components/ai-elements/message/types";
import { cn } from "@/lib/utils";
export const MessageToolbar = ({ className, children, ...props }: MessageToolbarProps) => (
  <div className={cn("mt-4 flex w-full items-center justify-between gap-4", className)} {...props}>
    {children}
  </div>
);
