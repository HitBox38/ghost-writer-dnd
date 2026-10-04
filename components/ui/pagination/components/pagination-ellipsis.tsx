import * as React from "react";
import { cn } from "cn";
import { MoreHorizontalIcon } from "lucide-react";
export const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
};
