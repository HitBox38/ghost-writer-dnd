"use client";

import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { inputGroupButtonVariants } from "@/components/ui/input-group/constants";
export const InputGroupButton = ({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) => {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(
        inputGroupButtonVariants({
          size,
        }),
        className,
      )}
      {...props}
    />
  );
};
