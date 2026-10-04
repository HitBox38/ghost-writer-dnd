import * as React from "react";
import { cn } from "cn";
export const AttachmentTitle = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
        className,
      )}
      {...props}
    />
  );
};
