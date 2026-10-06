import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { emptyMediaVariants } from "@/components/ui/empty/constants";
export const EmptyMedia = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) => {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(
        emptyMediaVariants({
          variant,
          className,
        }),
      )}
      {...props}
    />
  );
};
