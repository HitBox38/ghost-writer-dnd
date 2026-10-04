import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";
export const Accordion = ({ className, ...props }: AccordionPrimitive.Root.Props) => {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
};
export { AccordionItem } from "@/components/ui/accordion/components/accordion-item";
export { AccordionTrigger } from "@/components/ui/accordion/components/accordion-trigger";
export { AccordionContent } from "@/components/ui/accordion/components/accordion-content";
