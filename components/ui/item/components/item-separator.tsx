import * as React from "react";
import { cn } from "cn";
import { Separator } from "@/components/ui/separator";
export const ItemSeparator = ({ className, ...props }: React.ComponentProps<typeof Separator>) => {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-2", className)}
      {...props}
    />
  );
};
