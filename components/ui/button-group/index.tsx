import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { buttonGroupVariants } from "@/components/ui/button-group/constants";
export const ButtonGroup = ({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) => {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        buttonGroupVariants({
          orientation,
        }),
        className,
      )}
      {...props}
    />
  );
};
export { ButtonGroupSeparator } from "@/components/ui/button-group/components/button-group-separator";
export { ButtonGroupText } from "@/components/ui/button-group/components/button-group-text";
export { buttonGroupVariants } from "@/components/ui/button-group/constants";
