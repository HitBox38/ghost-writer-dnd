import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "cn";
import { itemMediaVariants } from "@/components/ui/item/constants";
export const ItemMedia = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) => {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        itemMediaVariants({
          variant,
          className,
        }),
      )}
      {...props}
    />
  );
};
