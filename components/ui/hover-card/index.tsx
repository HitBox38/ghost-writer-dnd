"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
export const HoverCard = ({ ...props }: PreviewCardPrimitive.Root.Props) => {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
};
export { HoverCardTrigger } from "@/components/ui/hover-card/components/hover-card-trigger";
export { HoverCardContent } from "@/components/ui/hover-card/components/hover-card-content";
