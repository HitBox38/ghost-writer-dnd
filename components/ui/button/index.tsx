import { type VariantProps } from "class-variance-authority";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button/constants";
export const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) => {
  return (
    <ButtonPrimitive
      {...props}
      data-slot="button"
      data-variant={variant}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
    />
  );
};
export { buttonVariants } from "@/components/ui/button/constants";
