"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
export const CollapsibleTrigger = ({ ...props }: CollapsiblePrimitive.Trigger.Props) => {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
};
