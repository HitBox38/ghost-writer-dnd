"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
export const ContextMenuRadioGroup = ({ ...props }: ContextMenuPrimitive.RadioGroup.Props) => {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
};
