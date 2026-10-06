import * as React from "react";
import { cn } from "cn";
export const MessageGroup = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  );
};
