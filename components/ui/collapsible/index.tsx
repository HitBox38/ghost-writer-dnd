"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
export const Collapsible = ({ ...props }: CollapsiblePrimitive.Root.Props) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};
export { CollapsibleTrigger } from "@/components/ui/collapsible/components/collapsible-trigger";
export { CollapsibleContent } from "@/components/ui/collapsible/components/collapsible-content";
