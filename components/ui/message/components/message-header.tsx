import * as React from "react";
import { cn } from "cn";
export const MessageHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0",
        className,
      )}
      {...props}
    />
  );
};
