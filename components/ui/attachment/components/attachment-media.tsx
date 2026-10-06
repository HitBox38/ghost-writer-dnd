import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "cn";
import { attachmentMediaVariants } from "@/components/ui/attachment/constants";
export const AttachmentMedia = ({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) => {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        attachmentMediaVariants({
          variant,
        }),
        className,
      )}
      {...props}
    />
  );
};
