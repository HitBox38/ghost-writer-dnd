import * as React from "react";
import { cn } from "cn";
export const BreadcrumbPage = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
};
