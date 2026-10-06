import * as React from "react";
import { cn } from "cn";
export const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
        className,
      )}
      {...props}
    />
  );
};
