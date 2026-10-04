import * as React from "react";
import { cn } from "cn";
export const Message = ({
  className,
  align = "start",
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end";
}) => {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
        className,
      )}
      {...props}
    />
  );
};
export { MessageGroup } from "./components/message-group";
export { MessageAvatar } from "./components/message-avatar";
export { MessageContent } from "./components/message-content";
export { MessageFooter } from "./components/message-footer";
export { MessageHeader } from "./components/message-header";
