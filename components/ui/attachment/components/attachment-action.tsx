import * as React from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
export const AttachmentAction = ({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn(className)}
      {...props}
    />
  );
};
