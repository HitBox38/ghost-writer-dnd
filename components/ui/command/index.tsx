"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "cn";
export const Command = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) => {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        className,
      )}
      {...props}
    />
  );
};
export { CommandDialog } from "@/components/ui/command/components/command-dialog";
export { CommandInput } from "@/components/ui/command/components/command-input";
export { CommandList } from "@/components/ui/command/components/command-list";
export { CommandEmpty } from "@/components/ui/command/components/command-empty";
export { CommandGroup } from "@/components/ui/command/components/command-group";
export { CommandItem } from "@/components/ui/command/components/command-item";
export { CommandShortcut } from "@/components/ui/command/components/command-shortcut";
export { CommandSeparator } from "@/components/ui/command/components/command-separator";
