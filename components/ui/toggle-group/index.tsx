"use client";

import { toggleVariants } from "@/components/ui/toggle";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "cn";
import { ToggleGroupContext } from "./constants";
export const ToggleGroup = ({
  className,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }) => {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={
        {
          "--gap": spacing,
        } as React.CSSProperties
      }
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=0]:data-[variant=outline]:shadow-xs data-vertical:flex-col data-vertical:items-stretch",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{
          variant,
          size,
          spacing,
          orientation,
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
};
export { ToggleGroupItem } from "./components/toggle-group-item";
