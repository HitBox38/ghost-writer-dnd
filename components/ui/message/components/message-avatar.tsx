import * as React from "react";
import { cn } from "cn";
export const MessageAvatar = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8",
        className,
      )}
      {...props}
    />
  );
};
