import * as React from "react";
import { cn } from "cn";
import { bubbleReactionsVariants } from "@/components/ui/bubble/constants";
export const BubbleReactions = ({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end";
  side?: "top" | "bottom";
}) => {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(
        bubbleReactionsVariants({
          side,
          align,
        }),
        className,
      )}
      {...props}
    />
  );
};
