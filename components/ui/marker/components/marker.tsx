"use client";

import { type VariantProps } from "class-variance-authority";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import { markerVariants } from "@/components/ui/marker/constants";
export const Marker = ({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) => {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          markerVariants({
            variant,
            className,
          }),
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  });
};
