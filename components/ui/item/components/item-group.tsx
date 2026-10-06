import * as React from "react";
import { cn } from "cn";
import { ItemSeparator } from "./item-separator";

export const ItemGroup = ({ className, children, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) =>
        child == null ? null : (
          <li
            role={
              React.isValidElement(child) && child.type === ItemSeparator
                ? "presentation"
                : undefined
            }
          >
            {child}
          </li>
        ),
      )}
    </ul>
  );
};
