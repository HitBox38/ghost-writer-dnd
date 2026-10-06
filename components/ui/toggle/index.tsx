"use client";

import { type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cn } from "cn";
import { toggleVariants } from "./constants";
export const Toggle = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) => {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(
        toggleVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
};
export { toggleVariants } from "./constants";
