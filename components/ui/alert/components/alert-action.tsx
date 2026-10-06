import * as React from "react";
import { cn } from "cn";
export const AlertAction = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  );
};
