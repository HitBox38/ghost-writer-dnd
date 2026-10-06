"use client";

import * as React from "react";
import { MessageScroller as MessageScrollerPrimitive } from "@shadcn/react/message-scroller";
import { cn } from "cn";
export const MessageScroller = ({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) => {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className,
      )}
      {...props}
    />
  );
};
export { MessageScrollerProvider } from "./components/message-scroller-provider";
export { MessageScrollerViewport } from "./components/message-scroller-viewport";
export { MessageScrollerContent } from "./components/message-scroller-content";
export { MessageScrollerItem } from "./components/message-scroller-item";
export { MessageScrollerButton } from "./components/message-scroller-button";
export { useMessageScrollerVisibility } from "@shadcn/react/message-scroller";
export { useMessageScrollerScrollable } from "@shadcn/react/message-scroller";
export { useMessageScroller } from "@shadcn/react/message-scroller";
