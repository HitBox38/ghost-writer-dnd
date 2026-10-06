import * as React from "react";
import { cn } from "cn";
export const ItemTitle = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
        className,
      )}
      {...props}
    />
  );
};
