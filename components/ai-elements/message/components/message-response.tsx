"use client";

import type { MessageResponseProps } from "@/components/ai-elements/message/types";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Streamdown } from "streamdown";
export const MessageResponse = memo(({ className, ...props }: MessageResponseProps) => (
  <Streamdown
    className={cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}
    {...props}
  />
));
MessageResponse.displayName = "MessageResponse";
