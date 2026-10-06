"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
export const Popover = ({ ...props }: PopoverPrimitive.Root.Props) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
};
export { PopoverContent } from "./components/popover-content";
export { PopoverDescription } from "./components/popover-description";
export { PopoverHeader } from "./components/popover-header";
export { PopoverTitle } from "./components/popover-title";
export { PopoverTrigger } from "./components/popover-trigger";
