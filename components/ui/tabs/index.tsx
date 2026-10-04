"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "cn";
export const Tabs = ({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
      {...props}
    />
  );
};
export { TabsList } from "./components/tabs-list";
export { TabsTrigger } from "./components/tabs-trigger";
export { TabsContent } from "./components/tabs-content";
export { tabsListVariants } from "./constants";
