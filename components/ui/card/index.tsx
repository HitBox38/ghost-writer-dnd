import * as React from "react";
import { cn } from "cn";
export const Card = ({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
}) => {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className,
      )}
      {...props}
    />
  );
};
export { CardHeader } from "@/components/ui/card/components/card-header";
export { CardFooter } from "@/components/ui/card/components/card-footer";
export { CardTitle } from "@/components/ui/card/components/card-title";
export { CardAction } from "@/components/ui/card/components/card-action";
export { CardDescription } from "@/components/ui/card/components/card-description";
export { CardContent } from "@/components/ui/card/components/card-content";
