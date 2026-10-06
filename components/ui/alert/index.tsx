import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "cn";
import { alertVariants } from "@/components/ui/alert/constants";
export const Alert = ({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) => {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        alertVariants({
          variant,
        }),
        className,
      )}
      {...props}
    />
  );
};
export { AlertTitle } from "@/components/ui/alert/components/alert-title";
export { AlertDescription } from "@/components/ui/alert/components/alert-description";
export { AlertAction } from "@/components/ui/alert/components/alert-action";
