"use client";

import type { MessageProps } from "@/components/ai-elements/message/types";
import { cn } from "@/lib/utils";
export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      "group flex w-full max-w-[95%] flex-col gap-2",
      from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
      className,
    )}
    {...props}
  />
);
export type { MessageProps } from "@/components/ai-elements/message/types";
export type { MessageContentProps } from "@/components/ai-elements/message/types";
export { MessageContent } from "@/components/ai-elements/message/components/message-content";
export type { MessageActionsProps } from "@/components/ai-elements/message/types";
export { MessageActions } from "@/components/ai-elements/message/components/message-actions";
export type { MessageActionProps } from "@/components/ai-elements/message/types";
export { MessageAction } from "@/components/ai-elements/message/components/message-action";
export type { MessageResponseProps } from "@/components/ai-elements/message/types";
export { MessageResponse } from "@/components/ai-elements/message/components/message-response";
export type { MessageToolbarProps } from "@/components/ai-elements/message/types";
export { MessageToolbar } from "@/components/ai-elements/message/components/message-toolbar";
