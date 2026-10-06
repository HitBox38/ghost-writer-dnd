import * as React from "react";
import { cn } from "cn";
export const PaginationContent = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
};
