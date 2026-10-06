import * as React from "react";
import { cn } from "cn";
export const AttachmentContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className,
      )}
      {...props}
    />
  );
};
