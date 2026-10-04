import * as React from "react";
import { cn } from "cn";
export const MessageContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
        className,
      )}
      {...props}
    />
  );
};
