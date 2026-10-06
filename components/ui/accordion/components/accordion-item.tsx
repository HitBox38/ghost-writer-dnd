import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";
export const AccordionItem = ({ className, ...props }: AccordionPrimitive.Item.Props) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  );
};
