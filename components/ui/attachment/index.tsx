import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "cn";
import { attachmentVariants } from "@/components/ui/attachment/constants";
export const Attachment = ({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done";
  }) => {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(
        attachmentVariants({
          size,
          orientation,
        }),
        className,
      )}
      {...props}
    />
  );
};
export { AttachmentGroup } from "@/components/ui/attachment/components/attachment-group";
export { AttachmentMedia } from "@/components/ui/attachment/components/attachment-media";
export { AttachmentContent } from "@/components/ui/attachment/components/attachment-content";
export { AttachmentTitle } from "@/components/ui/attachment/components/attachment-title";
export { AttachmentDescription } from "@/components/ui/attachment/components/attachment-description";
export { AttachmentActions } from "@/components/ui/attachment/components/attachment-actions";
export { AttachmentAction } from "@/components/ui/attachment/components/attachment-action";
export { AttachmentTrigger } from "@/components/ui/attachment/components/attachment-trigger";
