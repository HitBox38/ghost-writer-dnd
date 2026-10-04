"use client";

import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "cn";
import { inputGroupAddonVariants } from "@/components/ui/input-group/constants";
export const InputGroupAddon = ({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) => {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        inputGroupAddonVariants({
          align,
        }),
        className,
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
};
