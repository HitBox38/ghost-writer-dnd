"use client";

import { type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "cn";
import { tabsListVariants } from "../constants";
export const TabsList = ({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        tabsListVariants({
          variant,
        }),
        className,
      )}
      {...props}
    />
  );
};
