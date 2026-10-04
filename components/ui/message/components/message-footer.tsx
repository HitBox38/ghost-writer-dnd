import * as React from "react";
import { cn } from "cn";
export const MessageFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        "flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end",
        className,
      )}
      {...props}
    />
  );
};
