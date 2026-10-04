"use client";

import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { fieldVariants } from "@/components/ui/field/constants";
export const Field = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) => {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        fieldVariants({
          orientation,
        }),
        className,
      )}
      {...props}
    />
  );
};
export { FieldLabel } from "@/components/ui/field/components/field-label";
export { FieldDescription } from "@/components/ui/field/components/field-description";
export { FieldError } from "@/components/ui/field/components/field-error";
export { FieldGroup } from "@/components/ui/field/components/field-group";
export { FieldLegend } from "@/components/ui/field/components/field-legend";
export { FieldSeparator } from "@/components/ui/field/components/field-separator";
export { FieldSet } from "@/components/ui/field/components/field-set";
export { FieldContent } from "@/components/ui/field/components/field-content";
export { FieldTitle } from "@/components/ui/field/components/field-title";
