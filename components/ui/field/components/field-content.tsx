"use client";

import { cn } from "cn";
export const FieldContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="field-content"
      className={cn("group/field-content flex flex-1 flex-col gap-1 leading-snug", className)}
      {...props}
    />
  );
};
