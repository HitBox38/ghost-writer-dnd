import * as React from "react";
import { cn } from "cn";
export const AttachmentDescription = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80",
        "max-w-full",
        className,
      )}
      {...props}
    />
  );
};
