import { type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "cn";
import { bubbleVariants } from "@/components/ui/bubble/constants";
export const Bubble = ({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end";
  }) => {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(
        bubbleVariants({
          variant,
        }),
        className,
      )}
      {...props}
    />
  );
};
export { BubbleGroup } from "@/components/ui/bubble/components/bubble-group";
export { BubbleContent } from "@/components/ui/bubble/components/bubble-content";
export { BubbleReactions } from "@/components/ui/bubble/components/bubble-reactions";
