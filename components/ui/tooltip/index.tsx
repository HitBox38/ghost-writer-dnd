"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
export const Tooltip = ({ ...props }: TooltipPrimitive.Root.Props) => {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
};
export { TooltipTrigger } from "./components/tooltip-trigger";
export { TooltipContent } from "./components/tooltip-content";
export { TooltipProvider } from "./components/tooltip-provider";
